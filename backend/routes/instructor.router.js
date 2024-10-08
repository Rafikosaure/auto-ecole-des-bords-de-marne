// imports
const express = require("express");
const controller = require("../controllers/instructor.controller.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const { documentUploadMany,
        documentUploadOne } = require("./../middlewares/documentUpload.js");

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
router.post("/document/add", verifyToken, documentUploadMany("documents"), controller.addDocument);
        // update one
router.put("/document/update/:id", verifyToken, documentUploadOne("documents"), controller.updateDocument);
        // delete one
router.delete("/document/delete/:id", verifyToken, controller.deleteDocument);


exports.router = router;