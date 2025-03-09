module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("students", {
    studentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    enrollmentNo: {
      type: Sequelize.STRING,
    },
    placementCellId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "placement_cells",
        key: "placementCellId",
      },
      onDelete: "CASCADE",
    },
    branch: {
      type: Sequelize.STRING,
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
  return Student;
};
