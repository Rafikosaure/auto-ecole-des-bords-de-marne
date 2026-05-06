// models/emailMessage.model.js
exports.emailMessage = (sequelize, DataTypes) => {
  const EmailMessage = sequelize.define('emailmessage', {
    messageId:  { type: DataTypes.STRING(191), allowNull: false, unique: true },
    studentId:  { type: DataTypes.STRING(64),  allowNull: false },
    recipient:  { type: DataTypes.STRING(191), allowNull: false }, // l'email destinataire (en clair)
    template:   { type: DataTypes.STRING(64),  allowNull: true },  // ex: 'relaunch', 'convocation_formation'
    sentAt:     { type: DataTypes.DATE,        allowNull: true },
    meta:       { type: DataTypes.JSON,        allowNull: false, defaultValue: {} },
  }, {
    tableName: 'email_messages',
    underscored: true,
  });
  return EmailMessage;
};
