// models/recruiter.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Recruiter = sequelize.define('Recruiter', {
    recruiter_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: DataTypes.TEXT,
    website: DataTypes.STRING(100),
    email: {
      type: DataTypes.STRING(100),
      validate: {
        isEmail: true,
      },
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Recruiter.associate = (models) => {
    Recruiter.belongsTo(models.User, {
      foreignKey: 'representative_id',
      as: 'representative',
    });

    Recruiter.hasMany(models.DriveRequest, { // Added missing association
      foreignKey: 'recruiter_id',
      as: 'drive_requests',
    });
  };

  return Recruiter;
};