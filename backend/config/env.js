// imports
const dotenv = require("dotenv");

dotenv.config(); 

// stores env variables into process.env
const ENV = {
  PORT: process.env.PORT,
}

// exports
exports.ENV = ENV;