const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/index.js").Admin;
const ENV = require("../config/env.js").ENV;

const getAllAdmin = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}

const getAdmin = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}

const updateAdmin = async (req, res, next) => {
    try {
    } catch (e) {        
    }
}

const deleteAdmin = async (req, res, next) => {
    try {
    } catch (e) {        
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
        res.status(400).json("An error has occured")
    }
}

const loginAdmin = async (req, res, next) => {
    try {
        // SQL Select query for a given usename
        const admin = await Admin.findOne({ where: { username: req.body.username }});
        // Error if the user is not found in the database or the password is wrong
        // Handled with one error prevent malicious user to guess one or the other 
        if(!admin || !await bcrypt.compare( req.body.password, admin.password)) return res.status(400).json("Connection error");
        // Creates a token to sign the connection cookie
        const token = jwt.sign({ id: admin.id }, ENV.TOKEN);
        // Sends the cookie as a response with httpOnly attribute to make it inaccessible by the user
        res.cookie("access_token", token, { httpOnly: true }).status(200).json(admin);
        console.log("Connexion reussie");
      } catch (error) {
        console.log(error.message);
        res.status(400).json(error.message);
      }
}


// exports
exports.getAllAdmin = getAllAdmin;
exports.getAdmin = getAdmin;
exports.updateAdmin = updateAdmin;
exports.deleteAdmin = deleteAdmin;
exports.registerAdmin = registerAdmin;
exports.loginAdmin = loginAdmin;