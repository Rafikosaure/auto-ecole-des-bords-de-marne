// imports
const express = require("express");
const controller = require("../controllers/document.controller.js");

// router initialization
const router = express.Router();

// routes
    // CRUD
        // add all documents for a student
router.post("/add/:studentId", controller.addAllDocuments);
        // add one document for a student
router.post("/add/:studentId/:documentId")
        // get all documents for a student
router.get("/getall/:studentId", controller.getAllDocuments);
        // get one document for a student
router.get("/get/:studentId/:documentId", controller.getDocument);
        // update all documents of a student
router.put("/update/:studentId", controller.updateAllDocuments)
        // update one document of a student
router.put("/update/:studentId/:documentId", controller.updateDocument)
        // delete all documents of a student
router.delete("/delete/:studentId", controller.deleteAllDocuments);
        // deletes one document of a student
router.delete("/delete/:studentId/:documentId", controller.deleteDocument);

exports.router = router;