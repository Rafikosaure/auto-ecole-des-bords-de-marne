// imports
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const ENV = require("./config/env.js").ENV;
const studentRouter = require("./routes/student.router.js").router;
const instructorRouter = require("./routes/instructor.router.js").router;
const adminRouter = require("./routes/admin.router.js").router;
const documentRouter = require("./routes/document.router.js").router;

// app
const app = express();

// middlewares
app.use(express.json());

// used to avoid having frontend requests rejected
app.use((error, req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", ENV.FRONTROUTE);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", true);
    return next();
})

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
})
app.use(cookieParser())

// URLS API PREFIX
app.use("/api/student", studentRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/document", documentRouter);

// exports
exports.app = app;