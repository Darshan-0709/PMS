const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Student = sequelize.define('Student', {
    student_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'Users', 
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
    enrollment_number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cgpa: {
      type: DataTypes.DECIMAL(3, 2),
      // allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    bachelors_gpa: {
      type: DataTypes.DECIMAL(3, 2),
      validate: {
        min: 0,
        max: 10,
      },
    },
    tenth_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      validate: {
        min: 0,
        max: 100,
      },
    },
    twelfth_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      validate: {
        min: 0,
        max: 100,
      },
    },
    diploma_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      validate: {
        min: 0,
        max: 100,
      },
    },
    backlogs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    live_backlogs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('placed', 'not placed'),
      defaultValue: 'not placed',
    },
    placement_cell_id: { // Added missing placement_cell_id field
      type: DataTypes.UUID,
      references: {
        model: 'PlacementCells', // Assuming table name is 'PlacementCells'
        key: 'placement_cell_id',
      },
      onDelete: 'SET NULL', // If placement cell is deleted, student remains
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

  Student.associate = (models) => {
    Student.belongsTo(models.User, {
      foreignKey: 'student_id',
      as: 'user',
    });

    Student.belongsTo(models.PlacementCell, {
      foreignKey: 'placement_cell_id',
      as: 'placement_cell',
    });
  };

  return Student;
};
