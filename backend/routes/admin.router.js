// imports
const express = require("express");
const controller = require("../controllers/admin.controller.js");

// router initialization
const router = express.Router();

// routes
    // CRUD
        // add
router.post("/add", controller.addAdmin);
        // get all
router.get("/getall", controller.getAllAdmin);
        // get one
router.get("get/:id", controller.getAdmin);
        // update one
router.put("/update/:id", controller.updateAdmin)
        // delete one
router.delete("/delete/:id", controller.deleteAdmin);
    // AUTHENTICATION
        // sign-up
router.post("/signup", controller.registerAdmin);
        // login
router.post("/login", controller.loginAdmin);

exports.router = router;