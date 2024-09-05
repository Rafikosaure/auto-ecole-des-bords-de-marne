// imports
const express = require("express");
const studentRouter = require("./routes/student.router.js").router;
const instructorRouter = require("./routes/instructor.router.js").router;
const adminRouter = require("./routes/admin.router.js").router;
const documentRouter = require("./routes/document.router.js").router;

// app
const app = express();


// middlewares
app.use(express.json());

// URLS API PREFIX
app.use("/api/student", studentRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/document", documentRouter);

// exports
exports.app = app;