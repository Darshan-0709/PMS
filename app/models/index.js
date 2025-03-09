const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
db.placementCell = require("./placementCell.model.js")(sequelize, Sequelize);
db.student = require("./student.modal.js")(sequelize, Sequelize);

// associations - user_placementCell
db.user.hasOne(db.placementCell, {
  foreignKey: "adminId",
  as: "placementCell",
});

db.placementCell.belongsTo(db.user, {
  foreignKey: "adminId",
  as: "admin",
});

// associations - student_user
db.student.belongsTo(db.user, {
  foreignKey: "studentId",
  as: "user",
});
db.user.hasOne(db.student, {
  foreignKey: "studentId",
  as: "student",
});

// associations - student_placementCell
db.placementCell.hasMany(db.student, {
  foreignKey: "placementCellId",
  as: "students",
});
db.student.belongsTo(db.placementCell, {
  foreignKey: "placementCellId",
  as: "placementCell",
});

db.TYPES = ["user", "placementCellAdmin", "student"];
module.exports = db;
