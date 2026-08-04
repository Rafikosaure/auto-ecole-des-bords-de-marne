// imports
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { ENV } = require("./config/env.js");
const path = require('path');
const studentRouter = require("./routes/student.router.js");
const instructorRouter = require("./routes/instructor.router.js");
const adminRouter = require("./routes/admin.router.js");
const documentRouter = require("./routes/document.router.js");
const remarkRouter = require("./routes/remark.router.js");
const emailRouter = require("./routes/email.router.js")

// app
const app = express();

// middlewares
app.use(express.json({ limit: '50mb' })); // Limite des requêtes à 50MB (pour les images base64)
app.use(cookieParser());

// cors config
app.use(cors({
    origin: ENV.FRONTENDROUTE,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Preflight Requests
// Express 5 (path-to-regexp v8) n'accepte plus le wildcard nu '*' : il doit
// être nommé, ex. '/{*splat}'.
app.options('/{*splat}', cors());

// STATIC FILES FOR STUDENT CONTRACT
app.use('/contract-signatures', express.static(path.join(__dirname, './assets/contractImages')));
app.use('/instructors-documents', express.static(path.join(__dirname, './assets/instructorsDocuments')));

// URLS API PREFIX
app.use("/api/student", studentRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/document", documentRouter);
app.use("/api/remark", remarkRouter);
app.use('/api/email', emailRouter)

// exports
exports.app = app;