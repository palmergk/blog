module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comment', {
        user: {type: DataTypes.INTEGER},
        blog: {type: DataTypes.INTEGER},
        content: {type: DataTypes.STRING},
    })
}