const instructorsDocument =  (connection, DataTypes) => {
    connection.define(
    "instructorsDocument",
    {
        type: {
            type: DataTypes.STRING,
        },
        document: {
            // 16,777,215 bytes of data
            // if any file too large error happens while uploading process the image further with sharp
            type: DataTypes.BLOB("medium"),
        }
    },
        {
            timestamp: true,
        }
    );
};

exports.instructorsDocument = instructorsDocument;