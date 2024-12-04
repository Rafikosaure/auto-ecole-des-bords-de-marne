const remark =  (connection, DataTypes) => {
    connection.define(
    "remark",
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