const recruiterService = require("../services/recruiter.service");

// Get all recruiters
exports.getAllRecruiters = async (req, res) => {
	try {
		const recruiters = await recruiterService.getAllRecruiters();
		res.status(200).json({ success: true, data: recruiters });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Get recruiter by ID
exports.getRecruiterById = async (req, res) => {
	try {
		const { id } = req.params;
		const recruiter = await recruiterService.getRecruiterById(id);
		res.status(200).json({ success: true, data: recruiter });
	} catch (error) {
		res.status(404).json({ success: false, error: error.message });
	}
};

// Update recruiter
exports.updateRecruiter = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		const updatedRecruiter = await recruiterService.updateRecruiter(
			id,
			updateData
		);
		res.status(200).json({ success: true, data: updatedRecruiter });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

// Delete recruiter (soft delete)
exports.deleteRecruiter = async (req, res) => {
	try {
		const { id } = req.params;
		await recruiterService.deleteRecruiter(id);
		res.status(200).json({
			success: true,
			message: "Recruiter deleted successfully"
		});
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

// Restore recruiter
exports.restoreRecruiter = async (req, res) => {
	try {
		const { id } = req.params;
		const restoredRecruiter = await recruiterService.restoreRecruiter(id);
		res.status(200).json({ success: true, data: restoredRecruiter });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};
