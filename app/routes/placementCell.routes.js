const express = require("express");
const router = express.Router();
const placementCellController = require("../controllers/placementCell.controller");
const {
	authenticate,
	authorize,
	authorizePlacementCellActions
} = require("../middlewares/auth.middleware");
const {
	validatePlacementCell
} = require("../validations/placementCell.validation");

// Get all placement cells
router.get(
	"/",
	authenticate,
	authorize("placement_cell", "recruiter", "student"),
	placementCellController.getAllPlacementCells
);

// Get placement cell by ID
router.get(
	"/:id",
	authenticate,
	authorize("placement_cell", "recruiter", "student"),
    authorizePlacementCellActions,
	placementCellController.getPlacementCellById
);

// Update placement cell
router.patch(
	"/:id/update",
	authenticate,
	authorize("placement_cell"),
	authorizePlacementCellActions,
	validatePlacementCell,
	placementCellController.updatePlacementCell
);

// Delete placement cell (soft delete)
router.delete(
	"/:id/delete",
	authenticate,
	authorize("placement_cell"),
	authorizePlacementCellActions,
	placementCellController.deletePlacementCell
);

// Restore placement cell
router.patch(
	"/:id/restore",
	authenticate,
	authorize("placement_cell"),
	authorizePlacementCellActions,
	placementCellController.restorePlacementCell
);

module.exports = router;
