const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiter.controller");
const {
	authenticate,
	authorize,
	authorizeRecruiterActions
} = require("../middlewares/auth.middleware");
const { validateRecruiter } = require("../validations/recruiter.validation");

// Get all recruiters
router.get(
	"/",
	authenticate,
	authorize("placement_cell", "recruiter", "student"),
	recruiterController.getAllRecruiters
);

// Get recruiter by ID
router.get(
	"/:id",
	authenticate,
	authorize("placement_cell", "recruiter", "student"),
	authorizeRecruiterActions,
	recruiterController.getRecruiterById
);

// Update recruiter
router.patch(
	"/:id/update",
	authenticate,
	authorize("recruiter"),
	authorizeRecruiterActions,
	validateRecruiter,
	recruiterController.updateRecruiter
);

// Delete recruiter (soft delete)
router.delete(
	"/:id/delete",
	authenticate,
	authorize("recruiter"),
	authorizeRecruiterActions,
	recruiterController.deleteRecruiter
);

// Restore recruiter
router.patch(
	"/:id/restore",
	authenticate,
	authorize("recruiter"),
	authorizeRecruiterActions,
	recruiterController.restoreRecruiter
);

module.exports = router;
