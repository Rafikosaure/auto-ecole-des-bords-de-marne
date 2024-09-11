const remark =  (connection, DataTypes) => {
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

exports.remark = remark;