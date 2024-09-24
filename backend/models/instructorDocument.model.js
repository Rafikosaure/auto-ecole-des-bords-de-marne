const instructorsDocument =  (connection, DataTypes) => {
    connection.define(
    "instructorsDocument",
    {
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

exports.instructorsDocument = instructorsDocument;