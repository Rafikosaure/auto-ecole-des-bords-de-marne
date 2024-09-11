const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/index.js").Admin;
const ENV = require("../config/env.js").ENV;

const getAllAdmins = async (req, res, next) => {
    try {
        // SQL Select query to get all admins
        const admins = await Admin.findAll();
        res.status(200).json(admins);
        console.table(admins);
    } catch (error) {
        console.log(error.message);
        res.status(404).json("Could not get admins", error.message);
    }
}

const getAdmin = async (req, res, next) => {
    try {
        // SQL Select query to get one admin by ID
        const admin = await Admin.findByPk(req.params.id);
        // error if no admin found given the id
        if(!admin) return res.status(404).json("Admin not found");
        res.status(200).json(admin);
    } catch (error) {
        console.log(error.message);
        res.status(404).json("An error has occured", error.message);
    }
}

const updateAdmin = async (req, res, next) => {
    try {
        // SQL Select query to get one admin by ID
        const admin = await Admin.findByPk(req.params.id);
        // return an error if no admin found
        if (!admin) return res.status(404).json("Admin not found");
        // SQL Select query to update selected admin with request's body
        await admin.update(req.body);
        res.status(200).json({message: "admin updated", admin});
    } catch (error) {
        console.log(error.message);
        res.status(404).json("An error has occured", error.message);  
    }
}

const deleteAdmin = async (req, res, next) => {
    try {
          // SQL Delete query to delete one admin by ID
          const admin = await Admin.destroy({ where: { id: req.params.id } });
          // return error if admin not found
          if (!admin) return res.status(404).json("Admin not found");
          res.status(200).json({ message: "Admin Deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(404).json("An error has occured", error.message);      
    }
}

// adds new admins to the database
const registerAdmin = async (req, res, next) => {
    try {
        // SQL create query
        await Admin.create({
            ...req.body,
            // password hashing for security
            password: await bcrypt.hash(req.body.password, 10),
          });
          res.status(201).json(`Admin ${req.body.username} has been registered!`);
    } catch (error) {
        console.log(error.message);
        res.status(404).json("An error has occured")
    }
}

const loginAdmin = async (req, res, next) => {
    try {
        // SQL Select query for a given usename
        const admin = await Admin.findOne({ where: { username: req.body.username }});
        // Error if the user is not found in the database or the password is wrong
        // Handled with one error prevent malicious user to guess one or the other 
        if(!admin || !await bcrypt.compare( req.body.password, admin.password)) return res.status(404).json("Connection error");
        // Creates a token to sign the connection cookie
        const token = jwt.sign({ id: admin.id }, ENV.TOKEN);
        // Sends the cookie as a response with httpOnly attribute to make it inaccessible by the user
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(admin);
        console.log("Connexion reussie");
      } catch (error) {
        console.log(error.message);
        res.status(404).json("An error has occured");
      }
}


// exports
exports.getAllAdmins = getAllAdmins;
exports.getAdmin = getAdmin;
exports.updateAdmin = updateAdmin;
exports.deleteAdmin = deleteAdmin;
exports.registerAdmin = registerAdmin;
exports.loginAdmin = loginAdmin;