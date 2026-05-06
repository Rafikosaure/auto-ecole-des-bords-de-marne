const { Sequelize } = require("sequelize");
const { connection } = require("../config/db.js");
const { ENV } = require("../config/env.js");
const { passwordHashing } = require("../middlewares/bcryptPassword.js");

const { emailOpen } = require("./emailOpen.model.js");
const { emailMessage } = require("./emailMessage.model.js");
const { admin: adminModel } = require("./admin.model.js");
const { student: studentModel } = require("./student.model.js");
const { remark: remarksModel } = require("./remark.model.js");
const { instructor: instructorModel } = require("./instructor.model.js");
const { studentsDocument: studentDocumentModel } = require("./studentsDocument.model.js");
const { instructorsDocument: instructorDocumentModel } = require("./instructorDocument.model.js");

try {
  // Init models
  adminModel(connection, Sequelize);
  studentModel(connection, Sequelize);
  remarksModel(connection, Sequelize);
  studentDocumentModel(connection, Sequelize);
  instructorModel(connection, Sequelize);
  instructorDocumentModel(connection, Sequelize);
  emailOpen(connection, Sequelize);
  emailMessage(connection, Sequelize);

  // Models instanciés
  const { admin, student, remark, studentsdocument, instructor, instructorsdocument, emailopen, emailmessage  } = connection.models;

  // Associations
  student.hasMany(studentsdocument, { onDelete: "cascade", foreignKey: "studentId", as: "documents" });
  studentsdocument.belongsTo(student, { foreignKey: "studentId", as: "student" });

  student.hasMany(remark, { onDelete: "cascade", foreignKey: "studentId", as: "remarks" });
  remark.belongsTo(student, { foreignKey: "studentId", as: "student" });

  instructor.hasMany(remark, { onDelete: "cascade", foreignKey: "instructorId", as: "remarks" });
  remark.belongsTo(instructor, { foreignKey: "instructorId", as: "instructor" });

  instructor.hasMany(instructorsdocument, { onDelete: "cascade", foreignKey: "instructorId", as: "documents" });
  instructorsdocument.belongsTo(instructor, { foreignKey: "instructorId", as: "instructor" });

  // EmailMessage <-> EmailOpen (1-to-1 via messageId, constraints: false car messageId n'est pas la PK)
  emailmessage.hasOne(emailopen, { foreignKey: 'messageId', sourceKey: 'messageId', as: 'open', constraints: false });
  emailopen.belongsTo(emailmessage, { foreignKey: 'messageId', targetKey: 'messageId', as: 'message', constraints: false });

  // Student <-> EmailMessage (logique uniquement : pas de FK DB, studentId est STRING vs id INTEGER)
  student.hasMany(emailmessage, { foreignKey: 'studentId', as: 'emailMessages', constraints: false });
  emailmessage.belongsTo(student, { foreignKey: 'studentId', as: 'student', constraints: false });

  // Connexion + sync
  connection.authenticate()
    .then(() => console.log(`Connection to "${ENV.DBNAME}" has been successful`))
    .catch((err) => console.error('DB authenticate failed:', err));


connection.sync()
  .then(async () => {
    const { admin } = connection.models;

    // ✅ Création idempotente basée sur l'email, sans toucher si l'admin existe déjà
    const [adminRow, created] = await admin.findOrCreate({
      where: { email: ENV.DEFAULTADMINEMAIL },
      defaults: {
        username: ENV.DEFAULTADMINUSERNAME,
        email: ENV.DEFAULTADMINEMAIL,
        password: await passwordHashing(ENV.DEFAULTADMINPASSWORD),
      },
    });

    console.log(
      created
        ? `Default admin ${ENV.DEFAULTADMINUSERNAME} has been created`
        : `Default admin already exists: ${adminRow.email}`
    );
  })
  .then(() => console.log(`Synchronized with "${ENV.DBNAME}"`))
  .catch((err) => console.error('DB sync failed:', err));





  // Exports
  exports.Admin = admin;
  exports.Student = student;
  exports.Remark = remark;
  exports.StudentsDocument = studentsdocument;
  exports.Instructor = instructor;
  exports.InstructorsDocument = instructorsdocument;
  exports.EmailOpen = emailopen;
  exports.EmailMessage = emailmessage;
  exports.sequelize = connection;

} catch (error) {
  console.error(`Unable to connect to "${ENV.DBNAME}" : ${error.message}`);
}
