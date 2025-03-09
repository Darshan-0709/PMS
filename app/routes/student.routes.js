const { authJwt } = require("../middleware");
const controller = require("../controllers/student.controller");
const express = require("express");
const router = express.Router();

router.get(
  "/",
  [authJwt.verifyToken, authJwt.placementCellAdminAccess],
  controller.findStudentByPlacementCell
);
router.get(
  "/:id",
  [authJwt.verifyToken, authJwt.studentOrPCAccess],
  controller.findStudent
);
router.post(
  "/update/:id",
  [authJwt.verifyToken, authJwt.studentAccess],
  controller.updateStudent
);

module.exports = router; // Export the router
