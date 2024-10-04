const { Remark } = require("../models");
const { errorHandler,
    createError,
    errors,
    contexts} = require('../middlewares/errorHandler.js');

const addRemark = async (req, res, next) => {
    try {
        // throw an error if both foreignKeys are null
        if(!req.body.studentId && !req.body.instructorId) throw createError(req, errors.ErrorUndefinedKey, contexts.remark);
        // SQL create query
        // Raises an error if foreignKeys do not exist in either table
        await Remark.create({
            ...req.body,
          });
          res.status(201).json(`Remark has been registered!`);
    } catch (error) {
        return errorHandler(req, res, error, contexts.remark);
    }
}

const getAllRemarks = async (req, res, next) => {
    try {
        // SQL Select query to get all remarks
        const remarks = await Remark.findAll();
        res.status(200).json(remarks);
    } catch (error) {
        return errorHandler(req, res, error, contexts.remark);
    }
}

const getRemark = async (req, res, next) => {
    try {
        // SQL Select query to get one remark by ID
        const remark = await Remark.findByPk(req.params.id);
        // error if no remark found given the id
        if(!remark) throw createError(req, errors.ErrorNotExist, contexts.remark);
        res.status(200).json(remark);
    } catch (error) {
        return errorHandler(req, res, error, contexts.remark);
    }
}

const updateRemark = async (req, res, next) => {
    try {
        // SQL Select query to get one remark by ID
        const remark = await Remark.findByPk(req.params.id);
        // return an error if no remark found
        if (!remark) throw createError(req, errors.ErrorNotExist, contexts.remark);
        // throw an error if both foreignKeys are null
        if(!req.body.studentId && !req.body.instructorId) throw createError(req, errors.ErrorUndefinedKey, contexts.remark);
        // SQL Select query to update selected remark with request's body
        await remark.update(req.body);
        res.status(200).json({message: "remark updated", remark});
    } catch (error) {
        return errorHandler(req, res, error, contexts.remark);
    }
}

const deleteRemark = async (req, res, next) => {
    try {
        // SQL Delete query to delete one remark by ID
        const remark = await Remark.destroy({ where: { id: req.params.id } });
        // return error if remark not found
        if (!remark) throw createError(req, errors.ErrorNotExist, contexts.remark);
        res.status(200).json({ message: "Remark Deleted" });
  } catch (error) {
        return errorHandler(req, res, error, contexts.remark);
  }
}

// exports
exports.addRemark = addRemark;
exports.getAllRemarks = getAllRemarks;
exports.getRemark = getRemark;
exports.updateRemark = updateRemark;
exports.deleteRemark = deleteRemark;