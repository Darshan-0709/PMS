const placementCellService = require("../services/placementCell.service");

// Get all placement cells
exports.getAllPlacementCells = async (req, res) => {
	try {
		const placementCells = await placementCellService.getAllPlacementCells();
		res.status(200).json({ success: true, data: placementCells });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Get placement cell by ID
exports.getPlacementCellById = async (req, res) => {
	try {
		const { id } = req.params;
		const placementCell = await placementCellService.getPlacementCellById(id);
		res.status(200).json({ success: true, data: placementCell });
	} catch (error) {
		res.status(404).json({ success: false, error: error.message });
	}
};

// Update placement cell
exports.updatePlacementCell = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		const updatedPlacementCell = await placementCellService.updatePlacementCell(
			id,
			updateData
		);
		res.status(200).json({ success: true, data: updatedPlacementCell });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

// Delete placement cell (soft delete)
exports.deletePlacementCell = async (req, res) => {
	try {
		const { id } = req.params;
		await placementCellService.deletePlacementCell(id);
		res.status(200).json({
			success: true,
			message: "Placement cell deleted successfully"
		});
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

// Restore placement cell
exports.restorePlacementCell = async (req, res) => {
	try {
		const { id } = req.params;
		const restoredPlacementCell =
			await placementCellService.restorePlacementCell(id);
		res.status(200).json({ success: true, data: restoredPlacementCell });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};
