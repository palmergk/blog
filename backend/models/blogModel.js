// This code exports a function that defines a Sequelize model for a 'blog' table.
module.exports = (sequelize, DataTypes) => {
    // The function returns a new Sequelize definition for the 'blog' table.
    return sequelize.define('blog', {
        title: {type: DataTypes.STRING},
        slug: {type: DataTypes.STRING},
        image: {type: DataTypes.STRING, allowNull: true},
        content: {type: DataTypes.TEXT},
        user: {type: DataTypes.INTEGER},
    })
 }