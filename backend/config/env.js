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
  TOKEN: process.env.TOKEN,
  FRONTROUTE: process.env.FRONTROUTE,
  DEFAULTADMINUSERNAME: process.env.DEFAULTADMINUSERNAME,
  DEFAULTADMINEMAIL: process.env.DEFAULTADMINEMAIL,
  DEFAULTADMINPASSWORD: process.env.DEFAULTADMINPASSWORD,
  INSTRUCTORSDOCUMENTSPATH: process.env.INSTRUCTORSDOCUMENTSPATH
}

// exports
exports.ENV = ENV;