const {Sequelize, DataTypes } = require("sequelize");


// Create a Sequelize instance with database connection details
const sequelize = new Sequelize('blogdb', 'root', '', {
    host:'localhost',
    dialect: 'mysql'
});

// Test the database connection
sequelize.authenticate()
    .then(() => { console.log(`Db connected`) })
    .catch((error) => { console.log(error) })

// Initialize an object to store Sequelize-related properties
const db = {}

// Assign the Sequelize instance to the 'sequelize' property of the 'db' object
db.sequelize = sequelize

// Assign the Sequelize library to the 'Sequelize' property of the 'db' object
db.Sequelize = Sequelize

// Register the 'users' table model
db.users = require('./userModel')(sequelize, DataTypes)
db.blogs = require('./blogModel')(sequelize, DataTypes)
db.comments = require('./comment')(sequelize, DataTypes)
db.likes = require('./like')(sequelize, DataTypes)
db.dislikes = require('./dislike')(sequelize, DataTypes)




// Synchronize the database tables (create if not exists) based on the defined models
db.sequelize.sync({ force: false }).then(() => console.log('Tables synced'))

// register relationships between models(tables)
// one to many relationship
db.users.hasMany(db.blogs, {foreignKey: 'user', as: 'bloguser'})
db.blogs.hasMany(db.comments, {foreignKey: 'blog', as: 'comment'})
db.users.hasMany(db.comments, {foreignKey: 'user', as: 'cuser'})
db.blogs.hasMany(db.likes, {foreignKey: 'blog', as: 'blikes'})
db.blogs.hasMany(db.dislikes, {foreignKey: 'blog', as: 'bdislikes'})
db.users.hasMany(db.likes, {foreignKey: 'user', as: 'ulikes'})
db.users.hasMany(db.dislikes, {foreignKey: 'user', as: 'udislikes'})

// one to one relationship
db.blogs.belongsTo(db.users, {foreignKey: 'user', as: 'bloguser'})
db.comments.belongsTo(db.blogs, {foreignKey: 'blog', as: 'comment'})
db.comments.belongsTo(db.users, {foreignKey: 'user', as:'cuser'})
db.likes.belongsTo(db.blogs, {foreignKey: 'blog', as: 'blikes'})
db.dislikes.belongsTo(db.blogs, {foreignKey: 'blog', as: 'bdislikes'})
db.likes.belongsTo(db.users, {foreignKey: 'user', as: 'ulikes'})
db.dislikes.belongsTo(db.users, {foreignKey: 'user', as: 'udislikes'})




// Export the 'db' object for use in other parts of the application
module.exports = db

//This code sets up a Sequelize instance to connect to a MySQL database, tests the connection, and defines a database object (db) that includes the Sequelize instance, the Sequelize library, and the registered 'users' table model. It also synchronizes the database tables based on the defined models and exports the 'db' object for use in other parts of the application.