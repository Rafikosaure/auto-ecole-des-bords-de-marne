const jwt = require("jsonwebtoken");

const Admin = require("../models/index.js").Admin;
const ENV = require("../config/env.js").ENV;
const { passwordHashing, passwordCompare } = require("../middlewares/bcryptPassword.js")
const { errorHandler,
        createError,
        contexts,
        errors} = require('../middlewares/errorHandler.js');
const { forgotPasswordTemplate } = require("../models/emails/forgotPassword.js");
const { sendEmail }= require("../middlewares/sendEmail.js");


const getAllAdmins = async (req, res, next) => {
    try {
        // SQL Select query to get all admins
        const admins = await Admin.findAll({attributes: {exclude: ["password"]}});
        res.status(200).json(admins);
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
}

const getAdmin = async (req, res, next) => {
    try {
        // SQL Select query to get one admin by ID
        const admin = await Admin.findByPk(req.params.id, {attributes: {exclude: ["password"]}});
        // error if no admin found given the id
        if(!admin) throw createError(req, errors.ErrorNotExist, contexts.admin);
        res.status(200).json(admin);
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
}

const updateAdmin = async (req, res, next) => {
    try {
        // SQL Select query to get one admin by ID
        const admin = await Admin.findByPk(req.params.id);
        // return an error if no admin found
        if (!admin) throw createError(req, errors.ErrorNotExist, contexts.admin);
        // SQL Select query to update selected admin with request's body
        await admin.update({
            ...req.body,
            // password hashing for security
            password: await passwordHashing(req.body.password),
        });
        delete admin.dataValues.password;
        res.status(200).json({message: "admin updated", admin});
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
}

const deleteAdmin = async (req, res, next) => {
    try {
          // SQL Delete query to delete one admin by ID
          const admin = await Admin.destroy({ where: { id: req.params.id } });
          // return error if admin not found
          if (!admin) throw createError(req, errors.ErrorNotExist, contexts.admin);
          res.status(200).json({ message: "Admin Deleted" });
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);   
    }
}

// adds new admins to the database
const registerAdmin = async (req, res, next) => {
    try {
        // SQL create query
        await Admin.create({
            ...req.body,
            // password hashing for security
            password: await passwordHashing(req.body.password),
          });
          res.status(201).json(`Admin ${req.body.username} has been registered!`);
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
}

const loginAdmin = async (req, res, next) => {
    try {
        // SQL Select query for a given usename
        const admin = await Admin.findOne({ where: { username: req.body.username }});
        // Error if the admin is not found in the database or the password is wrong
        // Handled with one error prevent malicious user to guess one or the other 
        if(!admin || !await passwordCompare(req.body.password, admin.password))
            throw createError(req, errors.ErrorWrongCredentials, contexts.admin);
        // Creates a token to sign the connection cookie
        const token = jwt.sign({ id: admin.id }, ENV.TOKEN);
        // Sends the cookie as a response with httpOnly attribute to make it inaccessible by the user
        res.cookie("access_token", token, { httpOnly: true }).status(200).json({message: "connected"});
        console.log(`logged in as ${admin.username}`);
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
}


const logoutAdmin = async (req, res, next) => {
    try {
        // removes the connection httponly cookie
        res.clearCookie("access_token").status(200).json({message: "logged out"});
        console.log("connection cookie has been removed");
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
}

const forgotPassword = async (req, res, next) => {
    try {        
        // checks if an email is provided with the request
        if(!req.body.email) throw createError(req, errors.ErrorUndefinedKey, contexts.admin);
        // gets an admin given an email
        const admin = await Admin.findOne({ where: { email: req.body.email }});
        // if no admin found throws errro
        if(!admin) throw createError(req, errors.ErrorNotExist, contexts.admin);
        // gets current date
        const date = new Date();
        // Modifies the content of the reset email
        const mailOption = {
            // admin's email
            email: admin.dataValues.email,
            subject: "Réinitialisation du mot de passe",
            message: forgotPasswordTemplate(
                admin.dataValues.username,
                // date DD/MM/YYYY
                date.toLocaleDateString("fr-FR"),
                // datetime HH:mm
                `${date.toLocaleTimeString("fr-FR").slice(0,5)}`,
                // jwt token is added to make a per admin TEMPORARY link
                `${ENV.FRONTROUTE}/password/reset?token=${jwt.sign({id: admin.dataValues.id, date: Date.now()}, ENV.RESETTOKEN)}`,
            )
        };
        // sends the email
        await sendEmail(mailOption);
        res.status(200).json({message: "email has been sent"});
        } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        // check if a query token is present with the request
        if(!req.query.token) throw createError(req, errors.ErrorNoToken, contexts.admin);
        // checks the validity of the reset token
        jwt.verify(req.query.token, ENV.RESETTOKEN, (error, data) => {
            // if an error occurs while validating throws an error
            if (error) throw createError(req, errors.ErrorInvalidToken, contexts.admin);
            // checks if the link has been sent more than ten minutes ago
            if(Date.now() - data.date > 600000) throw createError(req, errors.ErrorExpiredToken, contexts.admin);
            // if both verifications are successfull adds the id param to the request
            req.params.id = data.id;
            // calls the update admin function to update the password
            updateAdmin(req, res, next);
        });
    } catch (error) {
        return errorHandler(req, res, error, contexts.admin);
    }
}


// exports
exports.getAllAdmins = getAllAdmins;
exports.getAdmin = getAdmin;
exports.updateAdmin = updateAdmin;
exports.deleteAdmin = deleteAdmin;
exports.registerAdmin = registerAdmin;
exports.loginAdmin = loginAdmin;
exports.logoutAdmin = logoutAdmin;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;