const studentsDocument = (connection, DataTypes) => {
    connection.define(
        "studentsdocument",
        {
            convocationTime: {
                type: DataTypes.DATE,
            },
            type: {
                type: DataTypes.STRING,
            },
            document: {
                // 16,777,215 bytes of data
                type: DataTypes.BLOB("medium"),
            }
        },
        {
            timestamp: true,
        }
    );
};

exports.studentsDocument = studentsDocument;