module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comment', {
        comment: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },        
    },{
        timestamps: true,
        paranoid: true,
    })
}