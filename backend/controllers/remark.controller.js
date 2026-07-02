const { prisma } = require("../prisma/client.js");
const { errorHandler, createError, errors, contexts } = require('../middlewares/errorHandler.js');

const addRemark = async (req, res, next) => {
    try {
        if (!req.body.studentId && !req.body.instructorId)
            throw createError(req, errors.undefinedKey, contexts.remark);
        await prisma.remark.create({
            data: {
                content: req.body.content,
                studentId: req.body.studentId ? parseInt(req.body.studentId) : null,
                instructorId: req.body.instructorId ? parseInt(req.body.instructorId) : null,
            },
        });
        res.status(201).json(`Remark has been registered!`);
    } catch (error) {
        return errorHandler(req, res, error, contexts.remark);
    }
};

const getAllRemarks = async (req, res, next) => {
    try {
        const remarks = await prisma.remark.findMany();
        res.status(200).json(remarks);
    } catch (error) {
        return errorHandler(req, res, error, contexts.remark);
    }
};

const getRemark = async (req, res, next) => {
    try {
        const remark = await prisma.remark.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!remark) throw createError(req, errors.notExist, contexts.remark);
        res.status(200).json(remark);
    } catch (error) {
        return errorHandler(req, res, error, contexts.remark);
    }
};

const updateRemark = async (req, res, next) => {
    try {
        const exists = await prisma.remark.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!exists) throw createError(req, errors.notExist, contexts.remark);
        if (!req.body.studentId && !req.body.instructorId)
            throw createError(req, errors.undefinedKey, contexts.remark);
        const remark = await prisma.remark.update({
            where: { id: parseInt(req.params.id) },
            data: {
                content: req.body.content,
                studentId: req.body.studentId ? parseInt(req.body.studentId) : null,
                instructorId: req.body.instructorId ? parseInt(req.body.instructorId) : null,
            },
        });
        res.status(200).json({ message: "remark updated", remark });
    } catch (error) {
        return errorHandler(req, res, error, contexts.remark);
    }
};

const deleteRemark = async (req, res, next) => {
    try {
        const exists = await prisma.remark.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!exists) throw createError(req, errors.notExist, contexts.remark);
        await prisma.remark.delete({ where: { id: parseInt(req.params.id) } });
        res.status(200).json({ message: "Remark Deleted" });
    } catch (error) {
        return errorHandler(req, res, error, contexts.remark);
    }
};

exports.addRemark = addRemark;
exports.getAllRemarks = getAllRemarks;
exports.getRemark = getRemark;
exports.updateRemark = updateRemark;
exports.deleteRemark = deleteRemark;
