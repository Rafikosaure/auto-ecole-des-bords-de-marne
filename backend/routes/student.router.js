// imports
const express = require("express");
const controller = require("../controllers/student.controller.js");

// router initialization
const router = express.Router();

// routes
    // CRUD
        // add
router.post("/add", controller.addStudent);
        // get all
router.get("/getall", controller.getAllStudents);
        // get one
router.get("/get/:id", controller.getStudent);
        // update one
router.put("/update/:id", controller.updateStudent)
        // delete one
router.delete("/delete/:id", controller.deleteStudent);

exports.router = router;