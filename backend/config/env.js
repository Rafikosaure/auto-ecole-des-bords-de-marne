// imports
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// Chemin (absolu, local au projet) où Playwright doit chercher/installer ses
// navigateurs. Doit être appliqué à process.env AVANT le premier `require('playwright')`
// de l'application (Playwright lit cette variable à l'import) — c'est pourquoi
// c'est fait ici, dans le module chargé en tout premier par le reste du code.
const PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(__dirname, "..", ".cache", "browsers");
process.env.PLAYWRIGHT_BROWSERS_PATH = PLAYWRIGHT_BROWSERS_PATH;

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
  RESETTOKEN: process.env.RESETTOKEN,
  FRONTENDROUTE: process.env.FRONTENDROUTE,
  BACKENDROUTE: process.env.BACKENDROUTE,
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
  COMPLETE_IMAGES_SIGNATURES_PATH: process.env.COMPLETE_IMAGES_SIGNATURES_PATH,

  // Chemin d'installation de playwright
  PLAYWRIGHT_BROWSERS_PATH,
}

// exports
exports.ENV = ENV;