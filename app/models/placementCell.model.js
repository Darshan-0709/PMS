// models/placementCell.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PlacementCell = sequelize.define(
    "PlacementCell",
    {
      placement_cell_id: { // Fixed typo (was placement_cell_id)
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      domain: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          is: /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/,
        },
      },
      branches: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue("branches");
          return rawValue ? rawValue.split(",") : [];
        },
        set(value) {
          this.setDataValue("branches", value.join(","));
        },
      },
      website: DataTypes.STRING(100),
      email: {
        type: DataTypes.STRING(100),
        validate: {
          isEmail: true,
        },
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  PlacementCell.associate = (models) => {
    PlacementCell.belongsTo(models.User, {
      foreignKey: "admin_id",
      as: "admin",
    });

    PlacementCell.hasMany(models.Student, {
      foreignKey: "placement_cell_id",
      as: "students",
    });

    PlacementCell.hasMany(models.DriveRequest, { // Added missing association
      foreignKey: "placement_cell_id",
      as: "drive_requests",
    });
  };

  return PlacementCell;
};