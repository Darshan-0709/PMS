// models/student.model.js
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
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    bachelors_gpa: DataTypes.DECIMAL(3, 2),
    tenth_percentage: DataTypes.DECIMAL(5, 2),
    twelfth_percentage: DataTypes.DECIMAL(5, 2),
    diploma_percentage: DataTypes.DECIMAL(5, 2),
    backlogs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    live_backlogs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('placed', 'not placed'),
      defaultValue: 'not placed',
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