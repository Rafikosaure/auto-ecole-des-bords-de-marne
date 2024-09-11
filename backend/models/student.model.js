export default (connection, DataTypes) => {
    connection.define(
    "Student",
    {
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        formationStart: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        formationDesiredEnd: {
            type: DataTypes.DATE,
        },
        formationMaxDuration: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
        {
            timestamp: true,
        }
    );
};