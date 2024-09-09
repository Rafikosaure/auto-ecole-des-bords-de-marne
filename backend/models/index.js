const connection = require("../config/db.js").connection;
const ENV = require("../config/env.js").ENV;
 
// database server authentication and databaase selection
const authentication = async () => {
    try {
        await connection.authenticate();
        console.log(`Connection to "${ENV.DBNAME}" has been successful`);
    } catch (error) {
        console.error(`Unable to connect to "${ENV.DBNAME}" : ${error.message}`);
    }
}

// initializes database tables (models)
const initialization = async () => {
    try {
        // models logic goes here
    } catch (error) {
        
    }
}

// models synchronization
const synchronization = async () => {
    await connection.sync({}); 
    console.log(`Synchronized with "${ENV.DBNAME}"`);
}

authentication();
initialization();
synchronization();