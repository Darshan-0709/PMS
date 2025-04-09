const express = require("express");
const router = express.Router();
const jobRequestController = require("../controllers/jobRequest.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { validateJobRequest } = require("../validations/jobRequest.validation");

// Get all job requests
router.get(
  "/",
  authenticate,
  authorize("recruiter", "placement_cell", "student"),
  jobRequestController.getAllJobRequests
);

// Get job request by ID
router.get(
  "/:id",
  authenticate,
  authorize("recruiter", "placement_cell", "student"),
  jobRequestController.getJobRequestById
);

// Create job request
router.post(
  "/",
  authenticate,
  authorize("recruiter"),
  validateJobRequest,
  jobRequestController.createJobRequest
);

// Update job request
router.patch(
  "/:id/update",
  authenticate,
  authorize("recruiter"),
  validateJobRequest,
  jobRequestController.updateJobRequest
);

// Delete job request (soft delete)
router.delete(
  "/:id/delete",
  authenticate,
  authorize("recruiter"),
  jobRequestController.deleteJobRequest
);

// Restore job request
router.patch(
  "/:id/restore",
  authenticate,
  authorize("recruiter"),
  jobRequestController.restoreJobRequest
);

module.exports = router;
