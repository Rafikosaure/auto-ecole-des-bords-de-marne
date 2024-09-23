const { Instructor } = require("../models");

const { errorHandler,
    createError,
    ErrorNotExist} = require('../middlewares/errorHandler.js');

// error handling
const context = "Instructor";

const addInstructor = async (req, res, next) => {
    try {
        // SQL create query
        await Instructor.create({
            ...req.body,
          });
          res.status(201).json(`Instructor ${req.body.lastName} ${req.body.firstName} has been registered!`);
    } catch (error) {
        return errorHandler(req, res, error, context);
    }
}

const getAllInstructors = async (req, res, next) => {
    try {
        // SQL Select query to get all instructors
        const instructors = await Instructor.findAll();
        res.status(200).json(instructors);
    } catch (error) {
        return errorHandler(req, res, error, context);
    }
}

const getInstructor = async (req, res, next) => {
    try {
        // SQL Select query to get one instructor by ID
        const instructor = await Instructor.findByPk(req.params.id);
        // error if no instructor found given the id
        if(!instructor) throw createError(req, ErrorNotExist, context);
        res.status(200).json(instructor);
    } catch (error) {
        return errorHandler(req, res, error, context);
    }
}

const updateInstructor = async (req, res, next) => {
    try {
        // SQL Select query to get one instructor by ID
        const instructor = await Instructor.findByPk(req.params.id);
        // return an error if no instructor found
        if (!instructor) throw createError(req, ErrorNotExist, context);
        // SQL Select query to update selected instructor with request's body
        await instructor.update(req.body)
        res.status(200).json({message: "instructor updated", instructor});
    } catch (error) {
        return errorHandler(req, res, error, context);
    }
}

const deleteInstructor = async (req, res, next) => {
    try {
        // SQL Delete query to delete one instructor by ID
        const instructor = await Instructor.destroy({ where: { id: req.params.id } });
        // return error if instructor not found
        if (!instructor) throw createError(req, ErrorNotExist, context);
        res.status(200).json({ message: "Instructor Deleted" });
  } catch (error) {
        return errorHandler(req, res, error, context);
  }
}

const addDocument = async (req, res, next) => {
    try {
        req.files ? console.log(req.files) : console.log("No file selected");
        res.status(200).json({ message: "kill yourself xd" })
    } catch (error) {
        return errorHandler(req, res, error, context);
    }
}


// exports
exports.addInstructor = addInstructor;
exports.getAllInstructors = getAllInstructors;
exports.getInstructor = getInstructor;
exports.updateInstructor = updateInstructor;
exports.deleteInstructor = deleteInstructor;
exports.addDocument = addDocument;