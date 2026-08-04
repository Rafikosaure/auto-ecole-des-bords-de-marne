const fs = require('fs');
const path = require('path');
const { prisma } = require("../prisma/client.js");
const { ENV } = require("../config/env.js");
const { errorHandler, createError, contexts, errors } = require('../middlewares/errorHandler.js');
const { processImage } = require('../middlewares/processImage.js');

const INSTRUCTOR_INCLUDE = { documents: true, remarks: true };

// Liste blanche des champs réellement modifiables : évite qu'un corps de
// requête ne fournisse des champs additionnels (id, createdAt, updatedAt, ou
// une écriture imbriquée sur les relations documents/remarks) transmis tels
// quels à Prisma.
const INSTRUCTOR_WRITABLE_FIELDS = ['lastName', 'firstName', 'email', 'phoneNumber', 'adress', 'speciality'];

const pickWritableFields = (body, fields) => {
    const picked = {};
    for (const field of fields) {
        if (body[field] !== undefined) picked[field] = body[field];
    }
    return picked;
};

const addInstructor = async (req, res, next) => {
    try {
        await prisma.instructor.create({ data: pickWritableFields(req.body, INSTRUCTOR_WRITABLE_FIELDS) });
        res.status(201).json(`Instructor ${req.body.lastName} ${req.body.firstName} has been registered!`);
    } catch (error) {
        return errorHandler(req, res, error, contexts.instructor);
    }
};

const getAllInstructors = async (req, res, next) => {
    try {
        const instructors = await prisma.instructor.findMany({
            include: INSTRUCTOR_INCLUDE,
            orderBy: { lastName: 'asc' },
        });
        instructors.forEach(instructor => {
            instructor.documents.forEach(doc => {
                if (doc.document) doc.document = doc.document.toString("base64");
            });
        });
        res.status(200).json(instructors);
    } catch (error) {
        return errorHandler(req, res, error, contexts.instructor);
    }
};

const getInstructor = async (req, res, next) => {
    try {
        const instructor = await prisma.instructor.findUnique({
            where: { id: parseInt(req.params.id) },
            include: INSTRUCTOR_INCLUDE,
        });
        if (!instructor) throw createError(req, errors.notExist, contexts.instructor);
        instructor.documents.forEach(doc => {
            if (doc.document) doc.document = doc.document.toString("base64");
        });
        res.status(200).json(instructor);
    } catch (error) {
        return errorHandler(req, res, error, contexts.instructor);
    }
};

const updateInstructor = async (req, res, next) => {
    try {
        const exists = await prisma.instructor.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!exists) throw createError(req, errors.notExist, contexts.instructor);
        const instructor = await prisma.instructor.update({
            where: { id: parseInt(req.params.id) },
            data: pickWritableFields(req.body, INSTRUCTOR_WRITABLE_FIELDS),
        });
        res.status(200).json({ message: "instructor updated", instructor });
    } catch (error) {
        return errorHandler(req, res, error, contexts.instructor);
    }
};

const deleteInstructor = async (req, res, next) => {
    try {
        const exists = await prisma.instructor.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!exists) throw createError(req, errors.notExist, contexts.instructor);
        await prisma.instructor.delete({ where: { id: parseInt(req.params.id) } });
        res.status(200).json({ message: "Instructor Deleted" });
    } catch (error) {
        return errorHandler(req, res, error, contexts.instructor);
    }
};

const addDocument = async (req, res, next) => {
    try {
        if (!req.body.instructorId) throw createError(req, errors.undefinedKey, contexts.instructorDocuments);
        const instructorExists = await prisma.instructor.findUnique({ where: { id: parseInt(req.body.instructorId) } });
        if (!instructorExists) throw createError(req, errors.notExist, contexts.instructor);
        if (req.files.length === 0) throw createError(req, errors.noFileProvided, contexts.instructorDocuments);

        let filesType = null;
        try {
            filesType = req.body?.filesType ? JSON.parse(req.body.filesType) : null;
        } catch {
            filesType = null;
        }

        for (const filename of req.files.filenames) {
            const file = fs.readFileSync(ENV.INSTRUCTORSDOCUMENTSPATH + "/" + filename);
            const index = req.files.filenames.indexOf(filename);
            await prisma.instructorDocument.create({
                data: {
                    instructorId: parseInt(req.body.instructorId),
                    type: filesType?.[index] ?? null,
                    document: await processImage(file, req.files.extensions[index]),
                    baseExtension: req.files.extensions[index],
                },
            });
            fs.rmSync(path.join(ENV.INSTRUCTORSDOCUMENTSPATH, filename));
        }
        return res.status(200).json({ message: "The files have been saved" });
    } catch (error) {
        fs.readdirSync(ENV.INSTRUCTORSDOCUMENTSPATH).forEach(file => {
            fs.rmSync(ENV.INSTRUCTORSDOCUMENTSPATH + "/" + file);
        });
        return errorHandler(req, res, error, contexts.instructorDocuments);
    }
};

const updateDocument = async (req, res, next) => {
    try {
        if (req.files.length === 0) throw createError(req, errors.noFileProvided, contexts.instructorDocuments);
        const document = await prisma.instructorDocument.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!document) throw createError(req, errors.notExist, contexts.instructorDocuments);
        const file = fs.readFileSync(ENV.INSTRUCTORSDOCUMENTSPATH + "/" + req.files.filenames[0]);
        await prisma.instructorDocument.update({
            where: { id: parseInt(req.params.id) },
            data: {
                type: req.body.type,
                document: await processImage(file, req.files.extensions[0]),
                baseExtension: req.files.extensions[0],
            },
        });
        fs.rmSync(path.join(ENV.INSTRUCTORSDOCUMENTSPATH, req.files.filenames[0]));
        return res.status(200).json({ message: "The document has been updated" });
    } catch (error) {
        fs.readdirSync(ENV.INSTRUCTORSDOCUMENTSPATH).forEach(file => {
            fs.rmSync(ENV.INSTRUCTORSDOCUMENTSPATH + "/" + file);
        });
        return errorHandler(req, res, error, contexts.instructorDocuments);
    }
};

const deleteDocument = async (req, res, next) => {
    try {
        const document = await prisma.instructorDocument.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!document) throw createError(req, errors.notExist, contexts.instructorDocuments);
        await prisma.instructorDocument.delete({ where: { id: parseInt(req.params.id) } });
        return res.status(200).json({ message: "The document has been deleted" });
    } catch (error) {
        return errorHandler(req, res, error, contexts.instructorDocuments);
    }
};

exports.addInstructor = addInstructor;
exports.getAllInstructors = getAllInstructors;
exports.getInstructor = getInstructor;
exports.updateInstructor = updateInstructor;
exports.deleteInstructor = deleteInstructor;
exports.addDocument = addDocument;
exports.updateDocument = updateDocument;
exports.deleteDocument = deleteDocument;
