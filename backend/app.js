// imports
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const ENV = require("./config/env.js").ENV;
const studentRouter = require("./routes/student.router.js").router;
const instructorRouter = require("./routes/instructor.router.js").router;
const adminRouter = require("./routes/admin.router.js").router;
const documentRouter = require("./routes/document.router.js").router;
const remarkRouter = require("./routes/remark.router.js").router;

// app
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// cors config
app.use(cors({
    origin: ENV.FRONTROUTE,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Preflight Requests
app.options('*', cors());

// URLS API PREFIX
app.use("/api/student", studentRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/document", documentRouter);
app.use("/api/remark", remarkRouter);

// exports
exports.app = app;