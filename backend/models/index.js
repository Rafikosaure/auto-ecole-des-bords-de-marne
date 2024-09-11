const { Sequelize } = require("sequelize");
const connection = require("../config/db.js").connection;
const ENV = require("../config/env.js").ENV;
const { default: studentModel } = require("./student.model.js");
const { default: adminModel } = require("./admin.model.js");
const { default: remarksModel } = require("./remark.model.js");
const { default: documentModel } = require("./document.model.js");
const { default: instructorModel } = require("./instructor.model.js");

try {
    // database server authentication and database selection
    connection.authenticate()
    .then(console.log(`Connection to "${ENV.DBNAME}" has been successful`));

    // models inithialization
    adminModel(connection, Sequelize);
    studentModel(connection, Sequelize);
    remarksModel(connection, Sequelize);
    documentModel(connection, Sequelize);
    instructorModel(connection, Sequelize);
    
    // models destructuration
    const { Admin, Student, Remark, Document, Instructor } = connection.models;

    // ASSOCIARTIONS
    //One-to-Many Association between Students and Documents
    Student.hasMany(Document, {onDelete: "cascade", foreignKey: "studentId", as: "documents"});
    //One-to-Many Association between Students and Remarks
    Student.hasMany(Remark, {onDelete: "cascade", foreignKey: "studentId", as: "remarks"});
    Document.belongsTo(Student, {foreignKey: "studentId", as: "student"});
    Remark.belongsTo(Student, {foreignKey: "studentId", as: "student"})


    // Synchronize the models with the database
    connection.sync()
    .then(console.log(`Synchronized with "${ENV.DBNAME}"`));

    // Export models
    exports.Admin = Admin;
    exports.Student = Student;
    exports.Remark = Remark;
    exports.Document = Document;
    exports.Instructor = Instructor;

} catch (error) {
    console.error(`Unable to connect to "${ENV.DBNAME}" : ${error.message}`);
}
