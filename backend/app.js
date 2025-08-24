// imports
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
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
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' })); // Limite des requêtes à 50MB (pour les images base64)

// cors config
app.use(cors({
    origin: ENV.FRONTROUTE,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Preflight Requests
app.options('*', cors());

// STATIC FILES FOR STUDENT CONTRACT
app.use('/contract-signatures', express.static(path.join(__dirname, './assets/contractImages')));
app.use('/instructors-documents', express.static(path.join(__dirname, './assets/instructorsDocuments')));

// EMAIL TRACKING
app.use('/api/tracking', emailRouter);

// URLS API PREFIX
app.use("/api/student", studentRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/document", documentRouter);
app.use("/api/remark", remarkRouter);
app.use('/api/emails', emailRouter)

// exports
exports.app = app;