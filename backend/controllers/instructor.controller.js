const fs = require('fs');
const sharp = require("sharp");
const { Instructor, instructorsDocument } = require("../models");
const { ENV } = require("../config/env.js");
const { errorHandler,
        createError,
        contexts,
        errors} = require('../middlewares/errorHandler.js');

const addInstructor = async (req, res, next) => {
    try {
        // SQL create query
        await Instructor.create({
            ...req.body,
          });
          res.status(201).json(`Instructor ${req.body.lastName} ${req.body.firstName} has been registered!`);
    } catch (error) {
        return errorHandler(req, res, error, contexts.instructor);
    }
}

const getAllInstructors = async (req, res, next) => {
    try {
        // SQL Select query to get all instructors
        const instructors = await Instructor.findAll({
            // includes values from other tables
            include: [
                {
                    model: instructorsDocument,
                    as: "documents"},
            ]
        });
        res.status(200).json(instructors);
    } catch (error) {
        return errorHandler(req, res, error, contexts.instructor);
    }
}

const getInstructor = async (req, res, next) => {
    try {
        // SQL Select query to get one instructor by ID
        const instructor = await Instructor.findByPk(req.params.id,
            {
                // includes values from other tables
                include: [
                    {
                        model: instructorsDocument,
                        as: "documents"},
                ]
            }
        );
        // error if no instructor found given the id
        if(!instructor) throw createError(req, errors.ErrorNotExist, contexts.instructor);
        res.status(200).json(instructor);
    } catch (error) {
        return errorHandler(req, res, error, contexts.instructor);
    }
}

const updateInstructor = async (req, res, next) => {
    try {
        // SQL Select query to get one instructor by ID
        const instructor = await Instructor.findByPk(req.params.id);
        // return an error if no instructor found
        if (!instructor) throw createError(req, errors.ErrorNotExist, contexts.instructor);
        // SQL Select query to update selected instructor with request's body
        await instructor.update(req.body);
        res.status(200).json({message: "instructor updated", instructor});
    } catch (error) {
        return errorHandler(req, res, error, contexts.instructor);
    }
}

const deleteInstructor = async (req, res, next) => {
    try {
        // SQL Delete query to delete one instructor by ID
        const instructor = await Instructor.destroy({ where: { id: req.params.id } });
        // return error if instructor not found
        if (!instructor) throw createError(req, errors.ErrorNotExist, contexts.instructor);
        res.status(200).json({ message: "Instructor Deleted" });
  } catch (error) {
        return errorHandler(req, res, error, contexts.instructor);
  }
}

const addDocument = async (req, res, next) => {
    try {
        // checks if an instructorId is provided with the request
        if(!req.body.instructorId) throw createError(req, errors.ErrorUndefinedKey, contexts.instructor);
        // checks if any file has been sent with the request
        if(req.files.length == 0) throw createError(req, errors.ErrorNoFileProvided, contexts.instructor);
        fs.readdirSync(ENV.INSTRUCTORSDOCUMENTSPATH).map(async file => {
            // full path to file
            file = ENV.INSTRUCTORSDOCUMENTSPATH + "/" + file;
            await instructorsDocument.create({
                ...req.body,
                // resizes the file
                document: await sharp(file).resize(500, 500, { fit: 'contain' }).toBuffer()
              })
            // deletes the file from instructor folder 
            fs.rmSync(file)
        })
        return res.status(200).json({message: "ok"})
    } catch (error) {
        // wipes the instructor folder incase an error occured
        fs.readdirSync(ENV.INSTRUCTORSDOCUMENTSPATH).map(file => {
            fs.rmSync(ENV.INSTRUCTORSDOCUMENTSPATH + "/" + file)
        })
        return errorHandler(req, res, error, contexts.instructor);
    }
}


// exports
exports.addInstructor = addInstructor;
exports.getAllInstructors = getAllInstructors;
exports.getInstructor = getInstructor;
exports.updateInstructor = updateInstructor;
exports.deleteInstructor = deleteInstructor;
exports.addDocument = addDocument;