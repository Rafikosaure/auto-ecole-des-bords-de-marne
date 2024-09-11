const { Instructor } = require("../models");

const addInstructor = async (req, res, next) => {
    try {
        // SQL create query
        await Instructor.create({
            ...req.body,
          });
          res.status(201).json(`Instructor ${req.body.lastName} ${req.body.firstName} has been registered!`);
    } catch (error) {
        console.log(error.message);
        res.status(404).json("An error has occured")
    }
}

const getAllInstructors = async (req, res, next) => {
    try {
        // SQL Select query to get all instructors
        const instructors = await Instructor.findAll();
        res.status(200).json(instructors);
        console.table(instructors);
    } catch (error) {
        console.log(error.message);
        res.status(404).json("Could not get instructors", error.message);
    }
}

const getInstructor = async (req, res, next) => {
    try {
        // SQL Select query to get one instructor by ID
        const instructor = await Instructor.findByPk(req.params.id);
        // error if no instructor found given the id
        if(!instructor) return res.status(404).json("Instructor not found");
        res.status(200).json(instructor);
    } catch (error) {
        console.log(error.message);
        res.status(404).json("An error has occured", error.message);
    }
}

const updateInstructor = async (req, res, next) => {
    try {
        // SQL Select query to get one instructor by ID
        const instructor = await Instructor.findByPk(req.params.id);
        // return an error if no instructor found
        if (!instructor) return res.status(404).json("Instructor not found");
        // SQL Select query to update selected instructor with request's body
        await instructor.update(req.body)
        res.status(200).json({message: "instructor updated", instructor});
    } catch (error) {
        console.log(error.message);
        res.status(404).json("An error has occured", error.message);  
    }
}

const deleteInstructor = async (req, res, next) => {
    try {
        // SQL Delete query to delete one instructor by ID
        const instructor = await Instructor.destroy({ where: { id: req.params.id } });
        // return error if instructor not found
        if (!instructor) return res.status(404).json("Instructor not found");
        res.status(200).json({ message: "Instructor Deleted" });
  } catch (error) {
      console.log(error.message);
      res.status(404).json("An error has occured", error.message);      
  }
}


// exports
exports.addInstructor = addInstructor;
exports.getAllInstructors = getAllInstructors;
exports.getInstructor = getInstructor;
exports.updateInstructor = updateInstructor;
exports.deleteInstructor = deleteInstructor;