const { Sequelize } = require("sequelize");
const connection = require("../config/db.js").connection;
const ENV = require("../config/env.js").ENV;
const passwordHashing = require("../middlewares/bcryptPassword.js").passwordHashing;

const adminModel = require("./admin.model.js").admin;
const studentModel = require("./student.model.js").student;
const remarksModel = require("./remark.model.js").remark;
const instructorModel = require("./instructor.model.js").instructor;
const studentDocumentModel = require("./studentsDocument.model.js").studentsDocument;
const instructorDocumentModel = require("./instructorDocument.model.js").instructorsDocument;

try {
    // database server authentication and database selection
    connection.authenticate()
    .then(console.log(`Connection to "${ENV.DBNAME}" has been successful`));

    // models inithialization
    adminModel(connection, Sequelize);
    studentModel(connection, Sequelize);
    remarksModel(connection, Sequelize);
    studentDocumentModel(connection, Sequelize);
    instructorModel(connection, Sequelize);
    instructorDocumentModel(connection, Sequelize);
    
    // models destructuration
    const { Admin, Student, Remark, studentsDocument, Instructor, instructorsDocument } = connection.models;

    // ASSOCIARTIONS
    //One-to-Many Association between Students and studentsDocuments
    Student.hasMany(studentsDocument, {onDelete: "cascade", foreignKey: "studentId", as: "documents"});
    studentsDocument.belongsTo(Student, {foreignKey: "studentId", as: "student"});
    //One-to-Many Association between Students and Remarks
    Student.hasMany(Remark, {onDelete: "cascade", foreignKey: "studentId", as: "remarks"});
    Remark.belongsTo(Student, {foreignKey: "studentId", as: "student"})
    //One-to-Many Association between Instructors and instructorsDocuments
    Instructor.hasMany(instructorsDocument, {onDelete: "cascade", foreignKey: "instructorId", as: "documents"});
    instructorsDocument.belongsTo(Instructor, {foreignKey: "instructorId", as: "instructor"})

    // Synchronize the models with the database
    connection.sync()
    .then(async () => {
        // checks if an admins exists in the db
        if(!(await Admin.findAndCountAll()).count){
            // creates default admin if no admin is in the db
            await Admin.create({
                username: ENV.DEFAULTADMINUSERNAME,
                email: ENV.DEFAULTADMINEMAIL,
                password: await passwordHashing(ENV.DEFAULTADMINPASSWORD)});
            console.log(`Default admin ${ENV.DEFAULTADMINUSERNAME} has been created`)
        };
    })
    .then(console.log(`Synchronized with "${ENV.DBNAME}"`));

    // Export models
    exports.Admin = Admin;
    exports.Student = Student;
    exports.Remark = Remark;
    exports.studentsDocument = studentsDocument;
    exports.Instructor = Instructor;
    exports.instructorsDocument = instructorsDocument;

} catch (error) {
    console.error(`Unable to connect to "${ENV.DBNAME}" : ${error.message}`);
}
