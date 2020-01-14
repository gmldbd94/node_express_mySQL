module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique:true,
        },
        nick: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        salt:{
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(40),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(40),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId: {
            type: DataTypes.STRING(40),
            allowNull: true,
        },
    },{
        timestamps: true,
        paranoid: true,
    })
}