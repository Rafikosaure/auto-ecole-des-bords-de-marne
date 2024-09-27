// imports
const express = require("express");
const controller = require("../controllers/instructor.controller.js");
const { ENV } = require("../config/env.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// creates the assets/instructors folders if they don't exist
if(!fs.existsSync(ENV.INSTRUCTORSDOCUMENTSPATH)){
    fs.mkdirSync(ENV.INSTRUCTORSDOCUMENTSPATH, {recursive: true})
     && console.log(`Path ${ENV.INSTRUCTORSDOCUMENTSPATH} has been created`)
}
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, ENV.INSTRUCTORSDOCUMENTSPATH);
    },
    filename: function (req, file, cb) {
        const filename = file.originalname + '-' + Date.now();
        req.files.files ??= new Array();
        req.files.files.push(filename);
        cb(null, filename);
    },
})
const upload = multer({
        storage: storage,
        limits: {
            files: 4
        },
        fileFilter: function(req, file, cb) {
            const extension = path.extname(file.originalname);
            if(extension !== ".png"
                && extension !== ".jpg"
                && extension !== ".jpeg"
                && extension !== ".pdf"
            ) {
                return(cb(new Error("Format not supported, supported format are .png .jpg .jpeg .pdf")));
            };
            cb(null, true)
        }
})
const uploadOne = multer({
        storage: storage,
        limits: {
            files: 1
        },
        fileFilter: function(req, file, cb) {
            const extension = path.extname(file.originalname);
            if(extension !== ".png"
                && extension !== ".jpg"
                && extension !== ".jpeg"
                && extension !== ".pdf"
            ) {
                return(cb(new Error("Format not supported, supported format are .png .jpg .jpeg .pdf")));
            };
            cb(null, true)
        }
})

// router initialization
const router = express.Router();

// routes
    // CRUD
        // add
router.post("/add", verifyToken, controller.addInstructor);
        // get all
router.get("/getall", verifyToken, controller.getAllInstructors);
        // get one
router.get("/get/:id", verifyToken, controller.getInstructor);
        // update one
router.put("/update/:id", verifyToken, controller.updateInstructor)
        // delete one
router.delete("/delete/:id", verifyToken, controller.deleteInstructor);
    // DOCUMENTS
        // add one or many
router.post("/document/add", verifyToken, upload.array("documents"), controller.addDocument);
        // update one
router.put("/document/update/:id", verifyToken, uploadOne.array("documents"), controller.updateDocument);
        // delete one
router.delete("/document/delete/:id", verifyToken, controller.deleteDocument);


exports.router = router;