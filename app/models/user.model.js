module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    userId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });

  return User;
};
