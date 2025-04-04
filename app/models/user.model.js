const bcrypt = require("bcrypt");

// models/user.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("student", "placement_cell", "recruiter"),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          fields: ["type"],
        },
      ],
    }
  );

  // User.associate = (models) => {
  //   User.hasOne(models.PlacementCell, {
  //     foreignKey: 'admin_id',
  //     as: 'placement_cell'
  //   });
  // };
  User.associate = (models) => {
    User.hasOne(models.Student, {
      foreignKey: "student_id",
      as: "student_profile",
      onDelete: "CASCADE",
    });

    User.hasOne(models.PlacementCell, {
      foreignKey: "admin_id",
      as: "admin_of_placement_cell",
      onDelete: "SET NULL",
    });

    User.hasOne(models.Recruiter, {
      foreignKey: "representative_id",
      as: "recruiter_profile",
      onDelete: "SET NULL",
    });
  };
  return User;
};
