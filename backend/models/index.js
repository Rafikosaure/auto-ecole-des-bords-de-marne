const { Sequelize } = require("sequelize");
const connection = require("../config/db.js").connection;
const ENV = require("../config/env.js").ENV;
const passwordHashing = require("../middlewares/bcryptPassword.js").passwordHashing;

const adminModel = require("./admin.model.js").admin;
const studentModel = require("./student.model.js").student;
const remarksModel = require("./remark.model.js").remark;
const documentModel = require("./document.model.js").document;
const instructorModel = require("./instructor.model.js").instructor;

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
    .then(async () => {
        // checks if an admins exixts in the db and creates default admin root if no admin is in the db
        !(await Admin.findAndCountAll()).count
         && (await Admin.create({username: ENV.DEFAULTADMINUSERNAME, password: await passwordHashing(ENV.DEFAULTADMINPASSWORD)}) && console.log(`Default admin ${ENV.DEFAULTADMINUSERNAME} has been created`));
    })
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
