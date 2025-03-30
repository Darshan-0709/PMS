const express = require('express');
const router = express.Router();
const placementCellController = require('../controllers/placementCell.controller');
const validate = require('../middleware/validation.middleware');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const placementCellValidation = require('../validations/placementCell.validation');

router.post(
  '/register',
  validate(placementCellValidation.register, 'body'),
  placementCellController.registerPlacementCell
);

router.put(
  '/profile',
  authenticate,
  authorize('placement_cell'),
  validate(placementCellValidation.updateProfile, 'body'),
  placementCellController.updateProfile
);

module.exports = router;