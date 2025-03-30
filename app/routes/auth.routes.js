const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validation.middleware");
const authValidation = require("../validations/auth.validation");

router.post(
  "/register",
  validate(authValidation.register, "body"),
  authController.register
);

router.post(
  "/login",
  validate(authValidation.login, "body"),
  authController.login
);

module.exports = router;