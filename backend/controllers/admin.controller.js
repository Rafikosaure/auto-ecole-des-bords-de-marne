const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/client.js");
const { ENV } = require("../config/env.js");
const { passwordHashing, passwordCompare } = require("../middlewares/bcryptPassword.js");
const { errorHandler, createError, contexts, errors } = require('../middlewares/errorHandler.js');
const { forgotPasswordTemplate } = require("../models/emails/forgotPassword.js");
const { sendEmail } = require("../middlewares/sendEmail.js");

const ADMIN_SELECT = { id: true, username: true, email: true, createdAt: true, updatedAt: true };

// Liste blanche des champs réellement modifiables : évite qu'un corps de
// requête ne fournisse des champs additionnels (id, createdAt, updatedAt)
// transmis tels quels à Prisma.
const ADMIN_WRITABLE_FIELDS = ['username', 'email'];
const pickWritableFields = (body, fields) => {
    const picked = {};
    for (const field of fields) {
        if (body[field] !== undefined) picked[field] = body[field];
    }
    return picked;
};

const getAllAdmins = async (req, res, next) => {
    try {
        const admins = await prisma.admin.findMany({
            select: ADMIN_SELECT,
            orderBy: { username: 'asc' },
        });
        res.status(200).json(admins);
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

const getAdmin = async (req, res, next) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: { id: parseInt(req.params.id) },
            select: ADMIN_SELECT,
        });
        if (!admin) throw createError(req, errors.notExist, contexts.admin);
        res.status(200).json(admin);
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

const updateAdmin = async (req, res, next) => {
    try {
        const exists = await prisma.admin.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!exists) throw createError(req, errors.notExist, contexts.admin);
        // Mot de passe optionnel : laissé vide, il reste inchangé (pas de re-hachage).
        const rest = pickWritableFields(req.body, ADMIN_WRITABLE_FIELDS);
        const data = req.body.password ? { ...rest, password: await passwordHashing(req.body.password) } : rest;
        const admin = await prisma.admin.update({
            where: { id: parseInt(req.params.id) },
            data,
            select: ADMIN_SELECT,
        });
        res.status(200).json({ message: "admin updated", admin });
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

const deleteAdmin = async (req, res, next) => {
    try {
        const exists = await prisma.admin.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!exists) throw createError(req, errors.notExist, contexts.admin);

        // Le tout premier compte administrateur (id le plus bas, indépendant
        // de tout tri d'affichage) ne peut pas être supprimé, pour éviter de
        // se retrouver sans aucun moyen de ré-accéder à l'administration.
        const firstAdmin = await prisma.admin.findFirst({ orderBy: { id: 'asc' } });
        if (firstAdmin && firstAdmin.id === exists.id) {
            return res.status(403).json({ message: "Le compte administrateur principal ne peut pas être supprimé." });
        }

        await prisma.admin.delete({ where: { id: parseInt(req.params.id) } });
        res.status(200).json({ message: "Admin Deleted" });
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

const registerAdmin = async (req, res, next) => {
    try {
        await prisma.admin.create({
            data: { ...pickWritableFields(req.body, ADMIN_WRITABLE_FIELDS), password: await passwordHashing(req.body.password) },
        });
        res.status(201).json(`Admin ${req.body.username} has been registered!`);
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

const loginAdmin = async (req, res, next) => {
    try {
        const admin = await prisma.admin.findFirst({ where: { username: req.body.username } });
        if (!admin || !await passwordCompare(req.body.password, admin.password))
            throw createError(req, errors.wrongCredentials, contexts.admin);
        const token = jwt.sign({ id: admin.id }, ENV.TOKEN, { expiresIn: '8h', algorithm: 'HS256' });
        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        }).status(200).json({ message: "connected" });
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

const logoutAdmin = async (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json({ message: "logged out" });
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        if (!req.body.email) throw createError(req, errors.undefinedKey, contexts.admin);
        const admin = await prisma.admin.findFirst({ where: { email: req.body.email } });
        // Ne jamais révéler si l'email correspond à un compte existant (évite
        // l'énumération de comptes) : la réponse au client est toujours la
        // même, que l'email soit trouvé ou non. Le cas "non trouvé" est
        // simplement journalisé côté serveur.
        if (admin) {
            const date = new Date();
            // pwdVersion lie le jeton au mot de passe actuel : une fois la
            // réinitialisation effectuée, updatedAt change et ce même jeton
            // ne peut plus être réutilisé (usage unique, sans avoir besoin
            // d'une table de jetons révoqués).
            const resetToken = jwt.sign(
                { id: admin.id, pwdVersion: admin.updatedAt.getTime() },
                ENV.RESETTOKEN,
                { expiresIn: '10m', algorithm: 'HS256' }
            );
            const mailOption = {
                email: admin.email,
                subject: "Réinitialisation du mot de passe",
                message: forgotPasswordTemplate(
                    admin.username,
                    date.toLocaleDateString("fr-FR"),
                    `${date.toLocaleTimeString("fr-FR").slice(0, 5)}`,
                    `${ENV.FRONTENDROUTE}/password/reset?token=${resetToken}`,
                ),
            };
            // Un échec d'envoi (SMTP indisponible, etc.) est journalisé mais
            // ne doit jamais changer la réponse envoyée au client : sinon,
            // l'énumération de comptes redevient possible en observant les
            // erreurs d'envoi.
            try {
                await sendEmail(mailOption);
            } catch (sendError) {
                console.error('Password reset email failed to send:', sendError);
            }
        } else {
            console.log(`Password reset requested for an unknown email: ${req.body.email}`);
        }
        res.status(200).json({ message: "If this email is registered, a reset link has been sent." });
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        if (!req.query.token) throw createError(req, errors.noToken, contexts.admin);
        let data;
        try {
            data = jwt.verify(req.query.token, ENV.RESETTOKEN, { algorithms: ['HS256'] });
        } catch (error) {
            if (error.name === 'TokenExpiredError')
                throw createError(req, errors.expiredToken, contexts.admin);
            throw createError(req, errors.invalidToken, contexts.admin);
        }
        const admin = await prisma.admin.findUnique({ where: { id: data.id } });
        if (!admin || admin.updatedAt.getTime() !== data.pwdVersion) {
            // Le mot de passe a changé depuis l'émission du jeton (déjà
            // utilisé, ou compte modifié entre-temps) : le jeton n'est plus
            // valide.
            throw createError(req, errors.invalidToken, contexts.admin);
        }
        req.params.id = data.id;
        return updateAdmin(req, res, next);
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

exports.getAllAdmins = getAllAdmins;
exports.getAdmin = getAdmin;
exports.updateAdmin = updateAdmin;
exports.deleteAdmin = deleteAdmin;
exports.registerAdmin = registerAdmin;
exports.loginAdmin = loginAdmin;
exports.logoutAdmin = logoutAdmin;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
