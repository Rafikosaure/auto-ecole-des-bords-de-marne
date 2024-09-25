// imports
const express = require("express");
const controller = require("../controllers/instructor.controller.js");
const { ENV } = require("../config/env.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

if(!fs.existsSync(ENV.INSTRUCTORSDOCUMENTSPATH)){
    fs.mkdirSync(ENV.INSTRUCTORSDOCUMENTSPATH, {recursive: true})
     && console.log(`Path ${ENV.INSTRUCTORSDOCUMENTSPATH} has been created`)
}
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, ENV.INSTRUCTORSDOCUMENTSPATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    },
})
const upload = multer({
        storage: storage,
        limits: {
            files: 4
        },
        fileFilter: function(req, file, cb) {
            var extension = path.extname(file.originalname);
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
router.post("/document/add", verifyToken, upload.array("file"), controller.addDocument);

exports.router = router;