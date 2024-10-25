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
router.post("/add",  addStudent);

router.get("/get",  getStudents);
// get all
router.get("/getall",  getAllStudents);
// get one
router.get("/get/:id",  getStudent);
// update one
router.put("/update/:id",  updateStudent);
// delete one
router.delete("/delete/:id",  deleteStudent);

module.exports = router;