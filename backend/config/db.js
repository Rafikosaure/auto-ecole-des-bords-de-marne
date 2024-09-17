const { Sequelize } = require("sequelize");
const ENV = require("./env").ENV

// creates the connection object used in index.js
const connection = new Sequelize(
    ENV.DBNAME, //database name
    ENV.DBUSER, //database username
    ENV.DBPASSWORD, //database password
    {
        host: ENV.DBHOST,  //database server ip
        dialect: ENV.DBDIALECT,  //database dialect (mysql)
        port: ENV.DBPORT,   //database port
    }
);

exports.connection = connection;