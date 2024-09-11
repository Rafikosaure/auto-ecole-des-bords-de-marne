// imports
const express = require("express");
const controller = require("../controllers/instructor.controller.js");

// router initialization
const router = express.Router();

// routes
    // CRUD
        // add
router.post("/add", controller.addInstructor);
        // get all
router.get("/getall", controller.getAllInstructors);
        // get one
router.get("/get/:id", controller.getInstructor);
        // update one
router.put("/update/:id", controller.updateInstructor)
        // delete one
router.delete("/delete/:id", controller.deleteInstructor);

exports.router = router;