module.exports = (sequelize, DataTypes) => {
    return sequelize.define('dislike', {
        user: {type: DataTypes.INTEGER},
        blog: {type: DataTypes.INTEGER},
    })
}