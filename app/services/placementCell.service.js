const { PlacementCell } = require("../models");
const { NotFoundError } = require("../utils/errors");

// Get all placement cells
exports.getAllPlacementCells = async () => {
	return await PlacementCell.findAll({ paranoid: false });
};

// Get placement cell by ID
exports.getPlacementCellById = async (placementCellId) => {
	const placementCell = await PlacementCell.findByPk(placementCellId, {
		paranoid: false,
		include: [
			{
				association: "admin",
				attributes: ["user_id", "username", "email", "type"]
			},
			{
				association: "representative",
				attributes: ["user_id", "username", "email", "type"]
			}
		]
	});

	if (!placementCell || placementCell.deleted_at) {
		throw new NotFoundError("Placement cell not found");
	}
	return placementCell;
};

// Update placement cell details
exports.updatePlacementCell = async (placementCellId, updateData) => {
	const placementCell = await PlacementCell.findByPk(placementCellId);
	if (!placementCell || placementCell.deleted_at) {
		throw new NotFoundError("Placement cell not found");
	}

	// Validate domains format if they are being updated
	if (updateData.domains) {
		updateData.domains.forEach((domain) => {
			if (!/^@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
				throw new Error(`Invalid domain format: ${domain}`);
			}
		});
	}

	await placementCell.update(updateData);
	return placementCell;
};

// Soft delete placement cell
exports.deletePlacementCell = async (placementCellId) => {
	const placementCell = await PlacementCell.findByPk(placementCellId);
	if (!placementCell) {
		throw new NotFoundError("Placement cell not found");
	}

	await placementCell.destroy();
	return { message: "Placement cell deleted successfully" };
};

// Restore soft-deleted placement cell
exports.restorePlacementCell = async (placementCellId) => {
	const placementCell = await PlacementCell.findByPk(placementCellId, {
		paranoid: false
	});
	if (!placementCell) {
		throw new NotFoundError("Placement cell not found");
	}

	if (!placementCell.deleted_at) {
		throw new Error("Placement cell is not deleted");
	}

	await placementCell.restore();
	return placementCell;
};
