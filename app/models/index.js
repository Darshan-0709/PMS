// models/index.js
const { Sequelize } = require("sequelize");
const config = require("../config/config");

// Initialize Sequelize with complete configuration
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'postgres', // Explicitly set
    logging: config.db.logging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Model imports
const User = require('./user.model.js')(sequelize);
const PlacementCell = require('./placementCell.model.js')(sequelize);
const Student = require('./student.model.js')(sequelize);
const Recruiter = require('./recruiter.model.js')(sequelize);

// Set up associations
User.associate?.({ PlacementCell, Student, Recruiter });
PlacementCell.associate?.({ User, Student });
Student.associate?.({ User, PlacementCell });
Recruiter.associate?.({ User });

const db = {
  sequelize,
  Sequelize,
  User,
  PlacementCell,
  Student,
  Recruiter
};

module.exports = db;