// imports
const express = require("express");
const controller = require("../controllers/admin.controller.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

// router initialization
const router = express.Router();

// routes
    // CRUD
        // get all
router.get("/getall", verifyToken, controller.getAllAdmins);
        // get one
router.get("/get/:id", verifyToken, controller.getAdmin);
        // update one
router.put("/update/:id", verifyToken, controller.updateAdmin)
        // delete one
router.delete("/delete/:id", verifyToken, controller.deleteAdmin);
    // AUTHENTICATION
        // sign-up
router.post("/signup", verifyToken, controller.registerAdmin);
        // login
router.post("/login", controller.loginAdmin);
        // logout
router.post("/logout", verifyToken, controller.logoutAdmin);
    // PASSWORD RESET
router.post("/password/forgot", controller.forgotPassword);
router.put("/password/reset", controller.resetPassword);

module.exports = router;