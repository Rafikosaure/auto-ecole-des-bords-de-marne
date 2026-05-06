// models/emailOpen.model.js
exports.emailOpen = (sequelize, DataTypes) => {
  const EmailOpen = sequelize.define('emailopen', {
    messageId:   { type: DataTypes.STRING(191), allowNull: false, unique: true },
    studentId:   { type: DataTypes.STRING(64),  allowNull: false },
    emailHash:   { type: DataTypes.STRING(64),  allowNull: false }, // sha256
    opensCount:  { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    firstOpenedAt: { type: DataTypes.DATE, allowNull: true },
    lastOpenedAt:  { type: DataTypes.DATE, allowNull: true },
    userAgents:  { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    ips:         { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  }, {
    tableName: 'email_opens',
    underscored: true,
  });

  return EmailOpen;
};
