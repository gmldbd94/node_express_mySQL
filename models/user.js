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
        password: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(40),
            allowNull: true,
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