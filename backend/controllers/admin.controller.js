const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/client.js");
const { ENV } = require("../config/env.js");
const { passwordHashing, passwordCompare } = require("../middlewares/bcryptPassword.js");
const { errorHandler, createError, contexts, errors } = require('../middlewares/errorHandler.js');
const { forgotPasswordTemplate } = require("../models/emails/forgotPassword.js");
const { sendEmail } = require("../middlewares/sendEmail.js");

const ADMIN_SELECT = { id: true, username: true, email: true, createdAt: true, updatedAt: true };

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
        const admin = await prisma.admin.update({
            where: { id: parseInt(req.params.id) },
            data: { ...req.body, password: await passwordHashing(req.body.password) },
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
        await prisma.admin.delete({ where: { id: parseInt(req.params.id) } });
        res.status(200).json({ message: "Admin Deleted" });
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

const registerAdmin = async (req, res, next) => {
    try {
        await prisma.admin.create({
            data: { ...req.body, password: await passwordHashing(req.body.password) },
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
        const token = jwt.sign({ id: admin.id }, ENV.TOKEN, { expiresIn: '8h' });
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
        if (!admin) throw createError(req, errors.notExist, contexts.admin);
        const date = new Date();
        const mailOption = {
            email: admin.email,
            subject: "Réinitialisation du mot de passe",
            message: forgotPasswordTemplate(
                admin.username,
                date.toLocaleDateString("fr-FR"),
                `${date.toLocaleTimeString("fr-FR").slice(0, 5)}`,
                `${ENV.FRONTENDROUTE}/password/reset?token=${jwt.sign({ id: admin.id }, ENV.RESETTOKEN, { expiresIn: '10m' })}`,
            ),
        };
        await sendEmail(mailOption);
        res.status(200).json({ message: "email has been sent" });
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        if (!req.query.token) throw createError(req, errors.noToken, contexts.admin);
        jwt.verify(req.query.token, ENV.RESETTOKEN, (error, data) => {
            if (error) {
                if (error.name === 'TokenExpiredError')
                    throw createError(req, errors.expiredToken, contexts.admin);
                throw createError(req, errors.invalidToken, contexts.admin);
            }
            req.params.id = data.id;
            updateAdmin(req, res, next);
        });
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
