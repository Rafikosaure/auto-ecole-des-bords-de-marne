const jwt = require("jsonwebtoken");

const Admin = require("../models/index.js").Admin;
const ENV = require("../config/env.js").ENV;
const { passwordHashing, passwordCompare } = require("../middlewares/bcryptPassword.js")
const { errorHandler,
        createError,
        contexts,
        errors} = require('../middlewares/errorHandler.js');


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


// exports
exports.getAllAdmins = getAllAdmins;
exports.getAdmin = getAdmin;
exports.updateAdmin = updateAdmin;
exports.deleteAdmin = deleteAdmin;
exports.registerAdmin = registerAdmin;
exports.loginAdmin = loginAdmin;
exports.logoutAdmin = logoutAdmin;