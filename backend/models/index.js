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
    const { admin, student, remark, studentsdocument, instructor, instructorsdocument } = connection.models;

    console.log(connection.models)

    // ASSOCIATIONS (foreignKeys)
    //One-to-Many Association between Students and studentsdocuments
    student.hasMany(studentsdocument, { onDelete: "cascade", foreignKey: "studentId", as: "documents" });
    studentsdocument.belongsTo(student, { foreignKey: "studentId", as: "student" });
    //One-to-Many Association between Students and Remarks
    student.hasMany(remark, { onDelete: "cascade", foreignKey: "studentId", as: "remarks" });
    remark.belongsTo(student, { foreignKey: "studentId", as: "student" });
    //One-to-Many Association between Instructors and Remarks
    instructor.hasMany(remark, { onDelete: "cascade", foreignKey: "instructorId", as: "remarks" });
    remark.belongsTo(instructor, { foreignKey: "instructorId", as: "instructor" });
    //One-to-Many Association between Instructors and instructorsdocuments
    instructor.hasMany(instructorsdocument, { onDelete: "cascade", foreignKey: "instructorId", as: "documents" });
    instructorsdocument.belongsTo(instructor, { foreignKey: "instructorId", as: "instructor" });

    // Synchronize the models with the database
    connection.sync()
        .then(async () => {
            // checks if an admins exists in the db
            if (!(await admin.findAndCountAll()).count) {
                // creates default admin if no admin is in the db
                await admin.create({
                    username: ENV.DEFAULTADMINUSERNAME,
                    email: ENV.DEFAULTADMINEMAIL,
                    password: await passwordHashing(ENV.DEFAULTADMINPASSWORD)
                });
                console.log(`Default admin ${ENV.DEFAULTADMINUSERNAME} has been created`);
            };
        })
        .then(console.log(`Synchronized with "${ENV.DBNAME}"`));

    // Export models
    exports.Admin = admin;
    exports.Student = student;
    exports.Remark = remark;
    exports.StudentsDocument = studentsdocument;
    exports.Instructor = instructor;
    exports.InstructorsDocument = instructorsdocument;

} catch (error) {
    console.error(`Unable to connect to "${ENV.DBNAME}" : ${error.message}`);
}
