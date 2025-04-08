const db = require("../models");
const { NotFoundError, ForbiddenError } = require("../utils/errors");
const { Op } = require("sequelize");

// Get all eligibility criteria for a recruiter
exports.getAllEligibilityCriteria = async (recruiterId) => {
  return await db.EligibilityCriteria.findAll({
    where: { recruiter_id: recruiterId },
    paranoid: false,
    include: [
      {
        association: "recruiter",
        attributes: ["recruiter_id", "company_name", "email"],
      },
    ],
  });
};

// Get eligibility criteria by ID
exports.getEligibilityCriteriaById = async (criteriaId, recruiterId) => {
  const criteria = await db.EligibilityCriteria.findByPk(criteriaId, {
    paranoid: false,
    include: [
      {
        association: "recruiter",
        attributes: ["recruiter_id", "company_name", "email"],
      },
    ],
  });

  if (!criteria || criteria.deleted_at) {
    throw new NotFoundError("Eligibility criteria not found");
  }

  if (criteria.recruiter_id !== recruiterId) {
    throw new ForbiddenError("Access denied: Not your eligibility criteria");
  }

  return criteria;
};

// Create eligibility criteria
exports.createEligibilityCriteria = async (recruiterId, criteriaData) => {
  // Verify recruiter exists
  const recruiter = await db.Recruiter.findByPk(recruiterId);
  if (!recruiter) {
    throw new NotFoundError("Recruiter not found");
  }

  const criteria = await db.EligibilityCriteria.create({
    ...criteriaData,
    recruiter_id: recruiterId,
  });

  return criteria;
};

// Update eligibility criteria
exports.updateEligibilityCriteria = async (
  criteriaId,
  recruiterId,
  updateData
) => {
  const criteria = await db.EligibilityCriteria.findByPk(criteriaId);
  if (!criteria || criteria.deleted_at) {
    throw new NotFoundError("Eligibility criteria not found");
  }

  if (criteria.recruiter_id !== recruiterId) {
    throw new ForbiddenError("Access denied: Not your eligibility criteria");
  }

  await criteria.update(updateData);
  return criteria;
};

// Delete eligibility criteria (soft delete)
exports.deleteEligibilityCriteria = async (criteriaId, recruiterId) => {
  const criteria = await db.EligibilityCriteria.findByPk(criteriaId);
  if (!criteria) {
    throw new NotFoundError("Eligibility criteria not found");
  }

  if (criteria.recruiter_id !== recruiterId) {
    throw new ForbiddenError("Access denied: Not your eligibility criteria");
  }

  await criteria.destroy();
  return { message: "Eligibility criteria deleted successfully" };
};

// Restore eligibility criteria
exports.restoreEligibilityCriteria = async (criteriaId, recruiterId) => {
  const criteria = await db.EligibilityCriteria.findByPk(criteriaId, {
    paranoid: false,
  });
  if (!criteria) {
    throw new NotFoundError("Eligibility criteria not found");
  }

  if (criteria.recruiter_id !== recruiterId) {
    throw new ForbiddenError("Access denied: Not your eligibility criteria");
  }

  if (!criteria.deleted_at) {
    throw new Error("Eligibility criteria is not deleted");
  }

  await criteria.restore();
  return criteria;
};
