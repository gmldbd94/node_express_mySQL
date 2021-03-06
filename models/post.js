module.exports = ( sequelize, DataTypes) => {
    return sequelize.define('post', {
        title: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(140),
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN(),
            DefaultValue: 1,
        },
    },{
        timestamps: true,
        paranoid: true,
    })
}
