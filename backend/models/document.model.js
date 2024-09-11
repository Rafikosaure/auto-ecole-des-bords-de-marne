export default (connection, DataTypes) => {
    connection.define(
    "Document",
    {
        convocationTime: {
            type: DataTypes.DATE,
        },
        type: {
            type: DataTypes.STRING,
        },
        document: {
            type: DataTypes.BLOB,
        }
    },
        {
            timestamp: true,
        }
    );
};