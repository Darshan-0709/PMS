const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const EligibilityCriteria = sequelize.define(
		"EligibilityCriteria",
		{
			criteria_id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true
			},
			name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
			recruiter_id: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "Recruiters",
					key: "recruiter_id"
				},
				onDelete: "CASCADE"
			},
			min_cgpa: {
				type: DataTypes.DECIMAL(3, 2),
				validate: {
					min: 0,
					max: 10
				}
			},
			min_bachelors_gpa: {
				type: DataTypes.DECIMAL(3, 2),
				validate: {
					min: 0,
					max: 10
				}
			},
			min_tenth_percentage: {
				type: DataTypes.DECIMAL(5, 2),
				validate: {
					min: 0,
					max: 100
				}
			},
			min_twelfth_percentage: {
				type: DataTypes.DECIMAL(5, 2),
				validate: {
					min: 0,
					max: 100
				}
			},
			min_diploma_percentage: {
				type: DataTypes.DECIMAL(5, 2),
				validate: {
					min: 0,
					max: 100
				}
			},
			max_backlogs: {
				type: DataTypes.INTEGER,
				validate: {
					min: 0
				}
			},
			max_live_backlogs: {
				type: DataTypes.INTEGER,
				validate: {
					min: 0
				}
			},
			deleted_at: {
				type: DataTypes.DATE,
				allowNull: true
			}
		},
		{
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
			paranoid: true,
			deletedAt: "deleted_at"
		}
	);

	EligibilityCriteria.associate = (models) => {
		EligibilityCriteria.belongsTo(models.Recruiter, {
			foreignKey: "recruiter_id",
			as: "recruiter"
		});
	};

	return EligibilityCriteria;
};
