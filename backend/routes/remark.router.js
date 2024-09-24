// imports
const express = require("express");
const controller = require("../controllers/remark.controller.js");

// router initialization
const router = express.Router();

// routes
    // CRUD
        // add
router.post("/add", controller.addRemark);
        // get all
router.get("/getall", controller.getAllRemarks);
        // get one
router.get("/get/:id", controller.getRemark);
        // update one
router.put("/update/:id", controller.updateRemark);
        // delete one
router.delete("/delete/:id", controller.deleteRemark);

exports.router = router;