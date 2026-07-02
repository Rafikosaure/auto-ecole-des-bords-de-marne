const { prisma } = require("../prisma/client.js");
const { errorHandler, createError, contexts, errors } = require("../middlewares/errorHandler.js");

const STUDENT_INCLUDE = { documents: true, remarks: true };

const addStudent = async (req, res, next) => {
    try {
        await prisma.student.create({ data: { ...req.body } });
        res.status(201).json(`Student ${req.body.lastName} ${req.body.firstName} has been registered!`);
    } catch (error) {
        return errorHandler(req, res, error, contexts.student);
    }
};

const getStudents = async (req, res, next) => {
    try {
        const students = await prisma.student.findMany({
            include: STUDENT_INCLUDE,
            orderBy: { lastName: 'asc' },
        });
        res.status(200).json(students);
    } catch (error) {
        return errorHandler(req, res, error, contexts.student);
    }
};

const getAllStudents = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [students, count] = await Promise.all([
            prisma.student.findMany({
                skip: offset,
                take: limit,
                include: STUDENT_INCLUDE,
                orderBy: { lastName: 'asc' },
            }),
            prisma.student.count(),
        ]);

        res.status(200).json({
            students,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalStudents: count,
        });
    } catch (error) {
        return errorHandler(req, res, error, contexts.student);
    }
};

const getStudent = async (req, res, next) => {
    try {
        const student = await prisma.student.findUnique({
            where: { id: parseInt(req.params.id) },
            include: STUDENT_INCLUDE,
        });
        if (!student) throw createError(req, errors.notExist, contexts.student);
        res.status(200).json(student);
    } catch (error) {
        return errorHandler(req, res, error, contexts.student);
    }
};

const updateStudent = async (req, res, next) => {
    try {
        const exists = await prisma.student.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!exists) throw createError(req, errors.notExist, contexts.student);
        const student = await prisma.student.update({
            where: { id: parseInt(req.params.id) },
            data: { ...req.body },
        });
        res.status(200).json({ message: "Student updated", student });
    } catch (error) {
        return errorHandler(req, res, error, contexts.student);
    }
};

const deleteStudent = async (req, res, next) => {
    try {
        const exists = await prisma.student.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!exists) throw createError(req, errors.notExist, contexts.student);
        await prisma.student.delete({ where: { id: parseInt(req.params.id) } });
        res.status(200).json({ message: "Student Deleted" });
    } catch (error) {
        return errorHandler(req, res, error, contexts.student);
    }
};

module.exports = { addStudent, getStudents, getAllStudents, getStudent, updateStudent, deleteStudent };
