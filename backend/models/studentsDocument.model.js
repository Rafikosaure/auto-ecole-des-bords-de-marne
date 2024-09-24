const studentsDocument =  (connection, DataTypes) => {
    connection.define(
    "studentsDocument",
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

exports.studentsDocument = studentsDocument;