const admin = (connection, DataTypes) => {
    connection.define(
    "admin",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique : true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
        {
            timestamp: true,
        }
    );
};

exports.admin = admin;