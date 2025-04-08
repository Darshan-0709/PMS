const { Recruiter } = require("../models");
const { NotFoundError } = require("../utils/errors");

// Get all recruiters
exports.getAllRecruiters = async () => {
	return await Recruiter.findAll({
		paranoid: false,
		include: [
			{
				association: "representative",
				attributes: ["user_id", "username", "email", "type"]
			}
		]
	});
};

// Get recruiter by ID
exports.getRecruiterById = async (recruiterId) => {
	const recruiter = await Recruiter.findByPk(recruiterId, {
		paranoid: false,
		include: [
			{
				association: "representative",
				attributes: ["user_id", "username", "email", "type"]
			}
		]
	});

	if (!recruiter || recruiter.deleted_at) {
		throw new NotFoundError("Recruiter not found");
	}
	return recruiter;
};

// Update recruiter details
exports.updateRecruiter = async (recruiterId, updateData) => {
	const recruiter = await Recruiter.findByPk(recruiterId);
	if (!recruiter || recruiter.deleted_at) {
		throw new NotFoundError("Recruiter not found");
	}

	await recruiter.update(updateData);
	return recruiter;
};

// Soft delete recruiter
exports.deleteRecruiter = async (recruiterId) => {
	const recruiter = await Recruiter.findByPk(recruiterId);
	if (!recruiter) {
		throw new NotFoundError("Recruiter not found");
	}

	await recruiter.destroy();
	return { message: "Recruiter deleted successfully" };
};

// Restore soft-deleted recruiter
exports.restoreRecruiter = async (recruiterId) => {
	const recruiter = await Recruiter.findByPk(recruiterId, { paranoid: false });
	if (!recruiter) {
		throw new NotFoundError("Recruiter not found");
	}

	if (!recruiter.deleted_at) {
		throw new Error("Recruiter is not deleted");
	}

	await recruiter.restore();
	return recruiter;
};
