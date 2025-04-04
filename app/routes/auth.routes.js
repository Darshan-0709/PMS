const express = require('express');
const router = express.Router();
const { validate, schemas } = require('../validations/auth.validation'); 
const authController = require('../controllers/auth.controller');

router.post('/register', 
  validate(schemas.registerSchema),
  authController.register
);

router.post('/login', 
  validate(schemas.loginSchema),
  authController.login
);

module.exports = router;