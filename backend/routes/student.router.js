// imports
const express = require("express");
const controller = require("../controllers/student.controller.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

// router initialization
const router = express.Router();

// routes
    // CRUD
        // add
router.post("/add", verifyToken, controller.addStudent);
        // get all
router.get("/getall", verifyToken, controller.getAllStudents);
        // get one
router.get("/get/:id", verifyToken, controller.getStudent);
        // update one
router.put("/update/:id", verifyToken, controller.updateStudent)
        // delete one
router.delete("/delete/:id", verifyToken, controller.deleteStudent);

exports.router = router;