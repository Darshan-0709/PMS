const { Recruiter } = require("../models");
const eligibilityCriteriaService = require("../services/eligibilityCriteria.service");

// Get all eligibility criteria for a recruiter
exports.getAllEligibilityCriteria = async (req, res) => {
	try {
		const { user } = req;
		const recruiter = await Recruiter.findOne({
			where: { representative_id: user.userId }
		});
		if (!recruiter) {
			return res
				.status(404)
				.json({ success: false, error: "Recruiter not found" });
		}

		const criteria = await eligibilityCriteriaService.getAllEligibilityCriteria(
			recruiter.recruiter_id
		);
		res.status(200).json({ success: true, data: criteria });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Get eligibility criteria by ID
exports.getEligibilityCriteriaById = async (req, res) => {
	try {
		const { id } = req.params;
		const { user } = req;
		const recruiter = await Recruiter.findOne({
			where: { representative_id: user.userId }
		});
		if (!recruiter) {
			return res
				.status(404)
				.json({ success: false, error: "Recruiter not found" });
		}

		const criteria =
			await eligibilityCriteriaService.getEligibilityCriteriaById(
				id,
				recruiter.recruiter_id
			);
		res.status(200).json({ success: true, data: criteria });
	} catch (error) {
		res.status(404).json({ success: false, error: error.message });
	}
};

// Create eligibility criteria
exports.createEligibilityCriteria = async (req, res) => {
	try {
		const { user } = req;
		const recruiter = await Recruiter.findOne({
			where: { representative_id: user.userId }
		});
		if (!recruiter) {
			return res
				.status(404)
				.json({ success: false, error: "Recruiter not found" });
		}

		const criteria = await eligibilityCriteriaService.createEligibilityCriteria(
			recruiter.recruiter_id,
			req.body
		);
		res.status(201).json({ success: true, data: criteria });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

// Update eligibility criteria
exports.updateEligibilityCriteria = async (req, res) => {
	try {
		const { id } = req.params;
		const { user } = req;
		const recruiter = await Recruiter.findOne({
			where: { representative_id: user.userId }
		});
		if (!recruiter) {
			return res
				.status(404)
				.json({ success: false, error: "Recruiter not found" });
		}

		const criteria = await eligibilityCriteriaService.updateEligibilityCriteria(
			id,
			recruiter.recruiter_id,
			req.body
		);
		res.status(200).json({ success: true, data: criteria });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

// Delete eligibility criteria
exports.deleteEligibilityCriteria = async (req, res) => {
	try {
		const { id } = req.params;
		const { user } = req;
		const recruiter = await Recruiter.findOne({
			where: { representative_id: user.userId }
		});
		if (!recruiter) {
			return res
				.status(404)
				.json({ success: false, error: "Recruiter not found" });
		}

		await eligibilityCriteriaService.deleteEligibilityCriteria(
			id,
			recruiter.recruiter_id
		);
		res.status(200).json({
			success: true,
			message: "Eligibility criteria deleted successfully"
		});
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

// Restore eligibility criteria
exports.restoreEligibilityCriteria = async (req, res) => {
	try {
		const { id } = req.params;
		const { user } = req;
		const recruiter = await Recruiter.findOne({
			where: { representative_id: user.userId }
		});
		if (!recruiter) {
			return res
				.status(404)
				.json({ success: false, error: "Recruiter not found" });
		}

		const criteria =
			await eligibilityCriteriaService.restoreEligibilityCriteria(
				id,
				recruiter.recruiter_id
			);
		res.status(200).json({ success: true, data: criteria });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};
