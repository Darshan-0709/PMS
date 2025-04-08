const express = require("express");
const router = express.Router();
const eligibilityCriteriaController = require("../controllers/eligibilityCriteria.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const {
	validateEligibilityCriteria
} = require("../validations/eligibilityCriteria.validation");

// Get all eligibility criteria for a recruiter
router.get(
	"/",
	authenticate,
	authorize("recruiter"),
	eligibilityCriteriaController.getAllEligibilityCriteria
);

// Get eligibility criteria by ID
router.get(
	"/:id",
	authenticate,
	authorize("recruiter"),
	eligibilityCriteriaController.getEligibilityCriteriaById
);

// Create eligibility criteria
router.post(
	"/",
	authenticate,
	authorize("recruiter"),
	validateEligibilityCriteria,
	eligibilityCriteriaController.createEligibilityCriteria
);

// Update eligibility criteria
router.patch(
	"/:id/update",
	authenticate,
	authorize("recruiter"),
	validateEligibilityCriteria,
	eligibilityCriteriaController.updateEligibilityCriteria
);

// Delete eligibility criteria (soft delete)
router.delete(
	"/:id/delete",
	authenticate,
	authorize("recruiter"),
	eligibilityCriteriaController.deleteEligibilityCriteria
);

// Restore eligibility criteria
router.patch(
	"/:id/restore",
	authenticate,
	authorize("recruiter"),
	eligibilityCriteriaController.restoreEligibilityCriteria
);

module.exports = router;
