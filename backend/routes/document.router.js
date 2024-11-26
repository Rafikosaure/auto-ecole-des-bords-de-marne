// imports
const express = require("express");
const controller = require("../controllers/document.controller.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const { generatePDFfromHTML } = require('../middlewares/generatePDF.js')
const { uploadImageMiddleware } = require('../middlewares/imageUpload.js')

// router initialization
const router = express.Router();

// routes
// CRUD
// add all documents for a student
router.post("/add/:studentId", verifyToken, controller.addAllDocuments);
// add one document for a student
router.post("/add/:studentId/:documentId", verifyToken, controller.addDocument);
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
// Upload contracts images (signatures and initials)
router.post('/uploadOneDocument/:studentId', uploadImageMiddleware, controller.uploadOneImage);
// Download one document
router.post("/downloadOneDocument/:studentId", generatePDFfromHTML, controller.downloadOneDocument);
// Deletion of temporary documents after contract generation
router.delete('/deleteDocumentsAfterContractGeneration/:studentId', controller.deleteDocumentsAfterContractGeneration);

module.exports = router;