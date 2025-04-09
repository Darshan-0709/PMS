const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const JobRequest = sequelize.define(
    "JobRequest",
    {
      job_request_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      recruiter_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Recruiters",
          key: "recruiter_id",
        },
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: DataTypes.TEXT,
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
          min: 0,
        },
      },
      location: DataTypes.STRING(255),
      job_type: {
        type: DataTypes.ENUM("full-time", "part-time", "internship"),
        allowNull: false,
      },
      eligibility_criteria_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "EligibilityCriteria",
          key: "criteria_id",
        },
        onDelete: "CASCADE",
      },
      allowed_departments: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("allowed_departments");
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
          if (!Array.isArray(value)) {
            throw new Error("Allowed departments must be an array");
          }
          this.setDataValue("allowed_departments", JSON.stringify(value));
        },
      },
      status: {
        type: DataTypes.ENUM("active", "closed"),
        defaultValue: "active",
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  JobRequest.associate = (models) => {
    JobRequest.belongsTo(models.Recruiter, {
      foreignKey: "recruiter_id",
      as: "recruiter",
    });

    JobRequest.belongsTo(models.EligibilityCriteria, {
      foreignKey: "eligibility_criteria_id",
      as: "eligibility_criteria",
    });
  };

  return JobRequest;
};
