export default (connection, DataTypes) => {
    connection.define(
    "Admin",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique : true,
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