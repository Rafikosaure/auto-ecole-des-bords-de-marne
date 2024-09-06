// imports
const dotenv = require("dotenv");

dotenv.config(); 

// stores env variables into process.env
const ENV = {
  SERVERPORT: process.env.SERVERPORT,
  SERVERIP: process.env.SERVERIP,
  DBPORT: process.env.DBPORT,
  DBNAME: process.env.DBNAME,
  DBHOST: process.env.DBHOST,
  DBUSER: process.env.DBUSER,
  DBPASSWORD: process.env.DBPASSWORD,
  DBDIALECT: process.env.DBDIALECT,
}

// exports
exports.ENV = ENV;