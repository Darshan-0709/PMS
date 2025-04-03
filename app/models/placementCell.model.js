// models/placementCell.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PlacementCell = sequelize.define(
    "PlacementCell",
    {
      placement_cell_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      domains: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("domains");
          try {
            return rawValue ? JSON.parse(rawValue) : [];
          } catch (error) {
            console.error("Error parsing domains:", error.message);
            return [];
          }
        },
        set(value) {
          if (!Array.isArray(value)) {
            throw new Error("Domains must be an array.");
          }
          value.forEach((domain) => {
            if (!/^@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
              throw new Error(`Invalid domain format: ${domain}`);
            }
          });
          this.setDataValue("domains", JSON.stringify(value)); // Ensure it's stored as a JSON string
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
  };

  return PlacementCell;
};
