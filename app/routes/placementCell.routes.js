const { authJwt } = require("../middleware");
const controller = require("../controllers/placementCell.controller");
const express = require("express");
const router = express.Router();

// Signup Route
router.post(
  "/:id",
  [authJwt.verifyToken, authJwt.placementCellAdminAccess],
  controller.setProfile
);

module.exports = router; // Export the router
