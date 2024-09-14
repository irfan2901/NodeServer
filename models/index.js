require('dotenv').config();
const { Sequelize } = require('sequelize');

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false
});

// Create a database object
const db = {};

// Add Sequelize and sequelize instances to db
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Require models
db.User = require('./user')(sequelize, Sequelize);

// Export the db object
module.exports = db;
