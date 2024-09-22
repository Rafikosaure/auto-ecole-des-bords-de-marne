// imports
const express = require("express");
const controller = require("../controllers/instructor.controller.js");
const { ENV } = require("../config/env.js");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, ENV.INSTRUCTORSDOCUMENTSPATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
})
const upload = multer({
        storage: storage,
        limits: {
            files: 4
        },
})

// router initialization
const router = express.Router();

// routes
    // CRUD
        // add
router.post("/add", controller.addInstructor);
        // get all
router.get("/getall", controller.getAllInstructors);
        // get one
router.get("/get/:id", controller.getInstructor);
        // update one
router.put("/update/:id", controller.updateInstructor)
        // delete one
router.delete("/delete/:id", controller.deleteInstructor);
    // DOCUMENTS
router.post("/document/add", upload.array("file"), controller.addDocument);

exports.router = router;