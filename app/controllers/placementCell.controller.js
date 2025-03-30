const { handleSuccess, handleError } = require('../utils/responseHandler');
const PlacementCellService = require('../services/placementCell.service');

module.exports = {
  registerPlacementCell: async (req, res) => {
    try {
      const result = await PlacementCellService.createPlacementCellUser(req.body);
      
      handleSuccess(res, {
        statusCode: 201,
        message: 'Placement cell created. Awaiting admin verification.',
        data: {
          userId: result.user.user_id,
          placementCellId: result.placementCell.placement_cell_id
        }
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  updateProfile: async (req, res) => {
    try {
      const updated = await PlacementCellService.updatePlacementCellProfile(
        req.user.userId,
        req.body
      );
      handleSuccess(res, {
        message: 'Profile updated successfully',
        data: updated
      });
    } catch (error) {
      handleError(res, error);
    }
  }
};
console.log(module.exports);