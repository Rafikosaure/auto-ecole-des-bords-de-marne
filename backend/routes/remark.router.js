// imports
const express = require("express");
const controller = require("../controllers/remark.controller.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

// router initialization
const router = express.Router();

// routes
// CRUD
// add
router.post("/add", verifyToken, controller.addRemark);
// get all
router.get("/getall", verifyToken, controller.getAllRemarks);
// get one
router.get("/get/:id", verifyToken, controller.getRemark);
// update one
router.put("/update/:id", verifyToken, controller.updateRemark);
// delete one
router.delete("/delete/:id", verifyToken, controller.deleteRemark);

module.exports = router;