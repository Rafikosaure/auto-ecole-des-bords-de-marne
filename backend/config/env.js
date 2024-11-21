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
  INSTRUCTORSDOCUMENTSPATH: `${__dirname}/../assets/instructorsDocuments`,
  STUDENTCONTRACTIMAGESPATH: `${__dirname}/../assets/contractImages`,

  // EMAIL & ATTACHMENTS VARIABLES
  EMAIL_SENDER_ADDRESS: process.env.EMAIL_SENDER_ADDRESS,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_TRACKING_ENDPOINT: process.env.EMAIL_TRACKING_ENDPOINT,
  COMPLETE_IMAGES_SIGNATURES_PATH: process.env.COMPLETE_IMAGES_SIGNATURES_PATH
}

// exports
exports.ENV = ENV;