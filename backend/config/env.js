const dotenv = require("dotenv");

dotenv.config();  // Charge les variables d'environnement

const ENV = {
  SERVERPORT: process.env.SERVERPORT || 3001,
  SERVERIP: process.env.SERVERIP || 'localhost',
  DBPORT: process.env.DBPORT || 3306,
  DBNAME: process.env.DBNAME,
  DBHOST: process.env.DBHOST,
  DBUSER: process.env.DBUSER,
  DBPASSWORD: process.env.DBPASSWORD,
  DBDIALECT: process.env.DBDIALECT || 'mysql',
  TOKEN: process.env.TOKEN,
  FRONTROUTE: process.env.FRONTROUTE
};

// Exporte les variables pour les utiliser dans db.js
module.exports = { ENV };
