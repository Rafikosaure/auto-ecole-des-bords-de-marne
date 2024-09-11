export default (connection, DataTypes) => {
    connection.define(
    "Remark",
    {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
        {
            timestamp: true,
        }
    );
};