const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const { findStudent } = require("../controllers/student.controller.js");
const User = db.user;

verifyToken = (req, res, next) => {
  const header = req.header("Authorization");
  if (!header) {
    return res.status(401).send({
      message: "No token provided!",
    });
  }
  let token = header.split(" ")[1];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!", error: err });
    }
    req.user = await User.findByPk(decoded.userId);
    next();
  });
};

placementCellAdminAccess = async (req, res, next) => {
  try {
    if (req.user.type !== "placementCellAdmin") {
      return res.status(403).send({
        message: "Require Placement Cell Admin Role!",
      });
    }
    const placementCell = await db.placementCell.findOne({
      where: {
        adminId: req.user.userId,
      },
    });
    if (!placementCell) {
      res.status(401).send({ message: "Unauthorized access!" });
    }
    req.placementCell = placementCell;
    next();
  } catch {
    return res.status(500).send({
      message: "Unable to validate Placement Cell Admin role!",
    });
  }
};

studentAccess = async (req, res, next) => {
  try {
    if (req.user.type !== "student") {
      return res.status(403).send({ message: "Require Student Role!" });
    }
    const student = await db.student.findByPk(req.user.userId);
    if (!student) {
      return res.status(401).send({ message: "Unauthorized access!" });
    }
    next();
  } catch {
    return res
      .status(500)
      .send({ message: "Unable to validate Student role!" });
  }
};

studentOrPCAccess = async (req, res, next) => {
  try {
    if (req.user.type !== "student" && req.user.type !== "placementCellAdmin") {
      return res.status(403).send({ message: "Unauthorized access!0" });
    }

    const student = await db.student.findByPk(req.params.id, {
      include: ["placementCell"],
    });
    console.log("student", student);

    if (!student) {
      return res.status(401).send({ message: "Unauthorized access!1" });
    }

    if (
      req.user.userId === student.studentId ||
      req.user.userId === student.placementCell.adminId
    ) {
      return next();
    }

    return res.status(401).send({ message: "Unauthorized access!2" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Unable to validate Student role!" });
  }
};

const authJwt = {
  verifyToken,
  studentAccess,
  placementCellAdminAccess,
  studentOrPCAccess,
};
module.exports = authJwt;
