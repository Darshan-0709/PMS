const db = require("../models");
const { NotFoundError, ForbiddenError } = require("../utils/errors");

// Get all job requests
exports.getAllJobRequests = async (recruiterId = null) => {
  const whereClause = recruiterId ? { recruiter_id: recruiterId } : {};
  return await db.JobRequest.findAll({
    where: whereClause,
    paranoid: false,
    include: [
      {
        association: "recruiter",
        attributes: ["recruiter_id", "company_name", "email"],
      },
      {
        association: "eligibility_criteria",
        attributes: [
          "criteria_id",
          "min_cgpa",
          "min_bachelors_gpa",
          "min_tenth_percentage",
          "min_twelfth_percentage",
          "min_diploma_percentage",
          "max_backlogs",
          "max_live_backlogs",
        ],
      },
    ],
  });
};

// Get job request by ID
exports.getJobRequestById = async (jobRequestId, recruiterId = null) => {
  const whereClause = { job_request_id: jobRequestId };
  if (recruiterId) {
    whereClause.recruiter_id = recruiterId;
  }

  const jobRequest = await db.JobRequest.findOne({
    where: whereClause,
    paranoid: false,
    include: [
      {
        association: "recruiter",
        attributes: ["recruiter_id", "company_name", "email"],
      },
      {
        association: "eligibility_criteria",
        attributes: [
          "criteria_id",
          "min_cgpa",
          "min_bachelors_gpa",
          "min_tenth_percentage",
          "min_twelfth_percentage",
          "min_diploma_percentage",
          "max_backlogs",
          "max_live_backlogs",
        ],
      },
    ],
  });

  if (!jobRequest) {
    throw new NotFoundError("Job request not found");
  }

  return jobRequest;
};

// Create job request
exports.createJobRequest = async (recruiterId, jobRequestData) => {
  // Verify recruiter exists
  const recruiter = await db.Recruiter.findByPk(recruiterId);
  if (!recruiter) {
    throw new NotFoundError("Recruiter not found");
  }

  // Verify eligibility criteria exists
  const eligibilityCriteria = await db.EligibilityCriteria.findByPk(
    jobRequestData.eligibility_criteria_id
  );
  if (!eligibilityCriteria) {
    throw new NotFoundError("Eligibility criteria not found");
  }

  const jobRequest = await db.JobRequest.create({
    ...jobRequestData,
    recruiter_id: recruiterId,
  });

  return jobRequest;
};

// Update job request
exports.updateJobRequest = async (jobRequestId, recruiterId, updateData) => {
  const jobRequest = await db.JobRequest.findByPk(jobRequestId);
  if (!jobRequest) {
    throw new NotFoundError("Job request not found");
  }

  if (jobRequest.recruiter_id !== recruiterId) {
    throw new ForbiddenError("Access denied: Not your job request");
  }

  // If updating eligibility criteria, verify it exists
  if (updateData.eligibility_criteria_id) {
    const eligibilityCriteria = await db.EligibilityCriteria.findByPk(
      updateData.eligibility_criteria_id
    );
    if (!eligibilityCriteria) {
      throw new NotFoundError("Eligibility criteria not found");
    }
  }

  await jobRequest.update(updateData);
  return jobRequest;
};

// Delete job request (soft delete)
exports.deleteJobRequest = async (jobRequestId, recruiterId) => {
  const jobRequest = await db.JobRequest.findByPk(jobRequestId);
  if (!jobRequest) {
    throw new NotFoundError("Job request not found");
  }

  if (jobRequest.recruiter_id !== recruiterId) {
    throw new ForbiddenError("Access denied: Not your job request");
  }

  await jobRequest.destroy();
  return { message: "Job request deleted successfully" };
};

// Restore job request
exports.restoreJobRequest = async (jobRequestId, recruiterId) => {
  const jobRequest = await db.JobRequest.findByPk(jobRequestId, {
    paranoid: false,
  });
  if (!jobRequest) {
    throw new NotFoundError("Job request not found");
  }

  if (jobRequest.recruiter_id !== recruiterId) {
    throw new ForbiddenError("Access denied: Not your job request");
  }

  if (!jobRequest.deleted_at) {
    throw new Error("Job request is not deleted");
  }

  await jobRequest.restore();
  return jobRequest;
};
