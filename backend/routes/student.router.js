// imports
const express = require("express");
const {
    addStudent,
    getStudents,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/student.controller.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

// router initialization
const router = express.Router();

// routes
// CRUD
// add
router.post("/add", verifyToken, addStudent);

router.get("/get", verifyToken, getStudents);
// get all
router.get("/getall", verifyToken, getAllStudents);
// get one
router.get("/get/:id", verifyToken, getStudent);
// update one
router.put("/update/:id", verifyToken, updateStudent);
// delete one
router.delete("/delete/:id", verifyToken, deleteStudent);

module.exports = router;