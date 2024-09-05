// imports
const express = require("express");


// app
const app = express();


// middlewares
app.use(express.json());

// exports
exports.app = app;