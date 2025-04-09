const jobRequestService = require("../services/jobRequest.service");
const db = require("../models");

// Get all job requests
exports.getAllJobRequests = async (req, res) => {
  try {
    const { user } = req;
    let jobRequests;

    if (user.type === "recruiter") {
      const recruiter = await db.Recruiter.findOne({
        where: { representative_id: user.userId },
      });
      if (!recruiter) {
        return res.status(404).json({
          success: false,
          error: "Recruiter not found",
        });
      }
      jobRequests = await jobRequestService.getAllJobRequests(
        recruiter.recruiter_id
      );
    } else {
      jobRequests = await jobRequestService.getAllJobRequests();
    }

    res.status(200).json({
      success: true,
      data: jobRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get job request by ID
exports.getJobRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    let jobRequest;

    if (user.type === "recruiter") {
      const recruiter = await db.Recruiter.findOne({
        where: { representative_id: user.userId },
      });
      if (!recruiter) {
        return res.status(404).json({
          success: false,
          error: "Recruiter not found",
        });
      }
      jobRequest = await jobRequestService.getJobRequestById(
        id,
        recruiter.recruiter_id
      );
    } else {
      jobRequest = await jobRequestService.getJobRequestById(id);
    }

    res.status(200).json({
      success: true,
      data: jobRequest,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

// Create job request
exports.createJobRequest = async (req, res) => {
  try {
    const { user } = req;
    const recruiter = await db.Recruiter.findOne({
      where: { representative_id: user.userId },
    });
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        error: "Recruiter not found",
      });
    }

    const jobRequest = await jobRequestService.createJobRequest(
      recruiter.recruiter_id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: jobRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update job request
exports.updateJobRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const recruiter = await db.Recruiter.findOne({
      where: { representative_id: user.userId },
    });
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        error: "Recruiter not found",
      });
    }

    const jobRequest = await jobRequestService.updateJobRequest(
      id,
      recruiter.recruiter_id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: jobRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete job request
exports.deleteJobRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const recruiter = await db.Recruiter.findOne({
      where: { representative_id: user.userId },
    });
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        error: "Recruiter not found",
      });
    }

    await jobRequestService.deleteJobRequest(id, recruiter.recruiter_id);

    res.status(200).json({
      success: true,
      message: "Job request deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Restore job request
exports.restoreJobRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const recruiter = await db.Recruiter.findOne({
      where: { representative_id: user.userId },
    });
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        error: "Recruiter not found",
      });
    }

    const jobRequest = await jobRequestService.restoreJobRequest(
      id,
      recruiter.recruiter_id
    );

    res.status(200).json({
      success: true,
      data: jobRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
