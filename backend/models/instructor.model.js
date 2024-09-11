export default (connection, DataTypes) => {
    connection.define(
    "Instructor",
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
            unique: true
        },
        adress: {
            type: DataTypes.STRING,
        },
        speciality: {
            type: DataTypes.STRING
        }
    },
        {
            timestamp: true,
        }
    );
};