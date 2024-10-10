const { Remark, Student, studentsDocument } = require("../models/index.js");

const {
  errorHandler,
  createError,
  contexts,
  errors,
} = require("../middlewares/errorHandler.js");

const addStudent = async (req, res, next) => {
  try {
    await Student.create({
      ...req.body,
    });
    res
      .status(201)
      .json(
        `Student ${req.body.lastName} ${req.body.firstName} has been registered!`
      );
  } catch (error) {
    return errorHandler(req, res, error, contexts.student);
  }
};

 const getStudents = async (req, res, next) => {
    try {
        // SQL Select query to get all students
        const students = await Student.findAll(
            {
                // includes values from other tables
                include: [
                    {
                        model: studentsDocument,
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
   
const getAllStudents = async (req, res, next) => {
  try {
 
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const offset = (page - 1) * limit; 

    const { count, rows: students } = await Student.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: studentsDocument,
          as: "documents",
        },
        {
          model: Remark,
          as: "remarks",
        },
      ],
    });

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
    const student = await Student.findByPk(req.params.id, {
      include: [
        {
          model: studentsDocument,
          as: "documents",
        },
        {
          model: Remark,
          as: "remarks",
        },
      ],
    });
    if (!student)
      throw createError(req, errors.ErrorNotExist, contexts.student);
    res.status(200).json(student);
  } catch (error) {
    return errorHandler(req, res, error, contexts.student);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student)
      throw createError(req, errors.ErrorNotExist, contexts.student);
    await student.update(req.body);
    res.status(200).json({ message: "Student updated", student });
  } catch (error) {
    return errorHandler(req, res, error, contexts.student);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.destroy({ where: { id: req.params.id } });
    if (!student)
      throw createError(req, errors.ErrorNotExist, contexts.student);
    res.status(200).json({ message: "Student Deleted" });
  } catch (error) {
    console.log(error.message);
    return errorHandler(req, res, error, contexts.student);
  }
};

// exports
exports.addStudent = addStudent;
exports.getStudents = getStudents;
exports.getAllStudents = getAllStudents;
exports.getStudent = getStudent;
exports.updateStudent = updateStudent;
exports.deleteStudent = deleteStudent;

