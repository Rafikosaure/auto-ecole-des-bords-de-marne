const fs = require('fs');
const { Instructor, instructorsDocument, Remark } = require("../models");
const { ENV } = require("../config/env.js");
const { errorHandler,
        createError,
        contexts,
        errors} = require('../middlewares/errorHandler.js');
const path = require('path');
const { processImage } = require('../middlewares/processImage.js');

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
                    as: "documents"
                },
                {
                    model: Remark,
                    as: "remarks"
                }
            ]
        });
        // converts documents buffer to base64 for an easy frontend integration
        instructors.map(instructor => {
            instructor.dataValues.documents.map(instructorsDocument => {
                data = instructorsDocument.dataValues
                data.document = Buffer.from(data.document).toString("base64") 
            });
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
                        as: "documents"
                    },
                    {
                        model: Remark,
                        as: "remarks"
                    }
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
        // checks if instructorId is valid
        if(!await Instructor.findByPk(req.body.instructorId)) throw createError(req, errors.ErrorNotExist, contexts.instructor);
        // checks if any file has been sent with the request
        if(req.files.length == 0) throw createError(req, errors.ErrorNoFileProvided, contexts.instructor);
        // maps over the req.files.files array that stores the filenames of the file recieved
        // the actual files are then found in the assets/instructors directory
        for(const fileName of req.files.files){
            // full path to file
            file = fs.readFileSync(ENV.BASEPATH + "/" + fileName);
            // SQL create query
            await instructorsDocument.create({
                ...req.body,
                // type will be null if a filesType ARRAY is not provided
                // ?. are here to avoid errors if the filesType ARRAY is not provided
                // req.files.files.indexOf(fileName) gets the index of the current file in the req.files.files object
                type: eval(req.body?.filesType)?.[req.files.files.indexOf(fileName)] ?? null,
                // resizes the file
                document: await processImage(file)
              });
            // deletes the file from instructor folder
            fs.rmSync(path.join(ENV.BASEPATH, fileName));
        }
        return res.status(200).json({message: "The files have been saved"});
    } catch (error) {
        // wipes the entire instructor folder in case an error occured
        fs.readdirSync(ENV.BASEPATH).map(file => {
            fs.rmSync(ENV.BASEPATH + "/" + file);
        })
        return errorHandler(req, res, error, contexts.instructor);
    }
}

const updateDocument = async (req, res, any) => {
    try {
        // checks if an instructorId is provided with the request
        if(!req.body.instructorId) throw createError(req, errors.ErrorUndefinedKey, contexts.instructor);
        // checks if instructorId is valid 
        if(!await Instructor.findByPk(req.body.instructorId)) throw createError(req, errors.ErrorNotExist, contexts.instructor);
        // checks if any file has been sent with the request
        if(req.files.length == 0) throw createError(req, errors.ErrorNoFileProvided, contexts.instructor);
        // SQL select query
        const document = await instructorsDocument.findByPk(req.params.id);
        if(!document) throw createError(req, errors.ErrorNotExist, contexts.instructorDocuments);
        // full path to file
        file = fs.readFileSync(ENV.BASEPATH + "/" + req.files.files[0]);
        await document.update({
            ...req.body,
            // resizes the file
            document: await processImage(file)
        });
        
        // deletes the file from instructor folder 
        fs.rmSync(path.join(ENV.BASEPATH, req.files.files[0]));
        return res.status(200).json({message: "The file has been updated"});
    } catch (error) {
        // wipes the entire instructor folder in case an error occured
        fs.readdirSync(ENV.BASEPATH).map(file => {
            fs.rmSync(ENV.BASEPATH + "/" + file);
        })
        return errorHandler(req, res, error, contexts.instructor);
    }
}

const deleteDocument = async (req, res, next) => {
    try {
        // checks if an instructorId is provided with the request
        if(!req.body.instructorId) throw createError(req, errors.ErrorUndefinedKey, contexts.instructor);
        // checks if instructorId is valid 
        if(!await Instructor.findByPk(req.body.instructorId)) throw createError(req, errors.ErrorNotExist, contexts.instructor);
        
        const document = await instructorsDocument.findByPk(req.params.id);
        if(!document) throw createError(req, errors.ErrorNotExist, contexts.instructorDocuments);
        // full path to file

        await document.destroy({
            ...req.body,
        });

        return res.status(200).json({message: "The file has been updated"});
    } catch (error) {
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
exports.updateDocument = updateDocument;
exports.deleteDocument = deleteDocument;