const db = require("../models");
const PlacementCell = db.placementCell;
const Student = db.student;
const { Op } = db.Sequelize;

const typeHandlers = {
  placementCellAdmin: async (user, req, transaction) => {
    const placementCell = await PlacementCell.create(
      {
        adminId: user.userId,
        name: req.body.placementCellName,
        email: req.body.placementCellEmail,
      },
      { transaction }
    );
    return placementCell;
  },

  student: async (user, req, transaction) => {
    const userDomain = user.email.split("@")[1];
    const placementCell = await PlacementCell.findOne({
      where: {
        domains: {
          [Op.like]: `%${userDomain}%`,
        },
      },
    });
    if (!placementCell) {
      throw new Error(
        "No placement cell found for the domain. Please Check with the placement cell admin."
      );
    }
    const student = await Student.create(
      {
        studentId: user.userId,
        enrollmentNo: req.body.enrollmentNo,
        branch: req.body.branch.toUpperCase(),
        placementCellId: placementCell.placementCellId,
      },
      { transaction }
    );
    return student;
  },
  // other type
};

module.exports = {
  executeTypeHandler: async (user, req, transaction) => {
    if (typeHandlers[user.type]) {
      return await typeHandlers[user.type](user, req, transaction);
    }
  },
};
