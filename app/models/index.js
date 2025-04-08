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
		dialect: "postgres", // Explicitly set
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
const User = require("./user.model.js")(sequelize);
const PlacementCell = require("./placementCell.model.js")(sequelize);
const Student = require("./student.model.js")(sequelize);
const Recruiter = require("./recruiter.model.js")(sequelize);
const EligibilityCriteria = require("./eligibilityCriteria.model.js")(
	sequelize
);

// Initialize models
const models = {
	User,
	PlacementCell,
	Student,
	Recruiter,
	EligibilityCriteria
};

// Set up associations
Object.keys(models).forEach((modelName) => {
	if (models[modelName].associate) {
		models[modelName].associate(models);
	}
});

const db = {
	sequelize,
	Sequelize,
	...models
};

module.exports = db;
