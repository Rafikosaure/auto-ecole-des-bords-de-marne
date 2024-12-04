const instructorsDocument = (connection, DataTypes) => {
    connection.define(
        "instructorsdocument",
        {
            type: {
                type: DataTypes.STRING,
            },
            baseExtension: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            document: {
                // 16,777,215 bytes of data
                // if any file too large error happens while uploading process the image further with sharp
                type: DataTypes.BLOB("medium"),
                allowNull: false
            }
        },
        {
            timestamp: true,
        }
    );
};

exports.instructorsDocument = instructorsDocument;