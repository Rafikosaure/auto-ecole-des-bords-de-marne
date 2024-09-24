const { Remark, Student, Document } = require("../models/index.js");

const { errorHandler,
    createError,
    contexts,
    errors} = require('../middlewares/errorHandler.js');

const addStudent = async (req, res, next) => {
    try {
        // SQL create query
        await Student.create({
            ...req.body,
          });
          res.status(201).json(`Student ${req.body.lastName} ${req.body.firstName} has been registered!`);
    } catch (error) {
        return errorHandler(req, res, error, contexts.student);
    }
}

const getAllStudents = async (req, res, next) => {
    try {
        // SQL Select query to get all students
        const students = await Student.findAll(
            {
                // includes values from other tables
                include: [
                    {
                        model: Document,
                        as: "documents"},
                    {
                        model: Remark,
                        as: "remarks"
                    }
            ]
        });
        res.status(200).json(students);
    } catch (error) {
        return errorHandler(req, res, error, contexts.student);
    }
}

const getStudent = async (req, res, next) => {
    try {
        // SQL Select query to get one student by ID
        const student = await Student.findByPk(req.params.id,
            {
                // includes values from other tables
                include: [
                    {
                        model: Document,
                        as: "documents"},
                    {
                        model: Remark,
                        as: "remarks"
                    }
                ]
            }
        );
        // error if no student found given the id
        if(!student) throw createError(req, errors.ErrorNotExist, contexts.student);
        res.status(200).json(student);
    } catch (error) {
        return errorHandler(req, res, error, contexts.student);
    }
}

const updateStudent = async (req, res, next) => {
    try {
        // SQL Select query to get one student by ID
        const student = await Student.findByPk(req.params.id);
        // return an error if no student found
        if (!student) throw createError(req, errors.ErrorNotExist, contexts.student);
        // SQL Select query to update selected student with request's body
        await student.update(req.body);
        res.status(200).json({message: "student updated", student});
    } catch (error) {
        return errorHandler(req, res, error, contexts.student);  
    }
}

const deleteStudent = async (req, res, next) => {
    try {
        // SQL Delete query to delete one student by ID
        const student = await Student.destroy({ where: { id: req.params.id } });
        // return error if student not found
        if (!student) throw createError(req, errors.ErrorNotExist, contexts.student);
        res.status(200).json({ message: "Student Deleted" });
  } catch (error) {
      console.log(error.message);
      return errorHandler(req, res, error, contexts.student);
  }
}

// exports
exports.addStudent = addStudent;
exports.getAllStudents = getAllStudents;
exports.getStudent = getStudent;
exports.updateStudent = updateStudent;
exports.deleteStudent = deleteStudent;