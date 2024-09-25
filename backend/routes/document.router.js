// imports
const express = require("express");
const controller = require("../controllers/document.controller.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

// router initialization
const router = express.Router();

// routes
    // CRUD
        // add all documents for a student
router.post("/add/:studentId", verifyToken, controller.addAllDocuments);
        // add one document for a student
router.post("/add/:studentId/:documentId")
        // get all documents for a student
router.get("/getall/:studentId", verifyToken, controller.getAllDocuments);
        // get one document for a student
router.get("/get/:studentId/:documentId", verifyToken, controller.getDocument);
        // update all documents of a student
router.put("/update/:studentId", verifyToken, controller.updateAllDocuments)
        // update one document of a student
router.put("/update/:studentId/:documentId", verifyToken, controller.updateDocument)
        // delete all documents of a student
router.delete("/delete/:studentId", verifyToken, controller.deleteAllDocuments);
        // deletes one document of a student
router.delete("/delete/:studentId/:documentId", verifyToken, controller.deleteDocument);

exports.router = router;