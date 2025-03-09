const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

// Signup Route
router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  controller.signup
);

// Signin Route
router.post("/signin", controller.signin);

// Signout Route
router.post("/signout", controller.signout);

module.exports = router; // Export the router
