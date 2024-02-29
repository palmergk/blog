module.exports = (sequelize, DataTypes) => {
    return sequelize.define('like', {
        user: {type: DataTypes.INTEGER},
        blog: {type: DataTypes.INTEGER},
    })
}