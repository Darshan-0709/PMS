// config/config.js
require('dotenv').config();

module.exports = {
  db: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'postgres', // Make sure this is explicitly set
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
};