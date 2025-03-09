module.exports = (sequelize, Sequelize) => {
  const PlacementCell = sequelize.define("placement_cells", {
    placementCellId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    adminId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "userId",
      },
      onDelete: "CASCADE",
    },
    domains: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    branches: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
  return PlacementCell;
};
