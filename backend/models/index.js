const { Sequelize } = require("sequelize");

const connection = require("../config/db.js").connection;
const ENV = require("../config/env.js").ENV;
const adminModel = require("./admin.model.js").default;
 

try {
    // database server authentication and databaase selection
    connection.authenticate()
    .then(console.log(`Connection to "${ENV.DBNAME}" has been successful`))
    
    // models synchronization
    adminModel(connection, Sequelize)
    const { Admin } = connection.models;
    connection.sync({})
    .then(console.log(`Synchronized with "${ENV.DBNAME}"`));

    exports.Admin = Admin;
} catch (error) {
    console.error(`Unable to connect to "${ENV.DBNAME}" : ${error.message}`);
}