const { handleSuccess, handleError } = require('../utils/responseHandler');
const AuthService = require('../services/auth.service');
const PlacementCellService = require('../services/placementCell.service');

module.exports = {
  register: async (req, res) => {
    try {
      const result = await AuthService.registerUser(req.body);
      
      handleSuccess(res, {
        statusCode: 201,
        message: 'Registration successful',
        data: {
          userId: result.user.user_id,
          type: result.user.type,
          accessToken: result.token,
          needsProfileCompletion: !result.user.is_profile_complete
        }
      });
    } catch (error) {
      handleError(res, error);
    }
  },
  
  login: async (req, res) => {
    try {
      const tokens = await AuthService.loginUser(req.body);
      handleSuccess(res, {
        message: 'Login successful',
        data: tokens
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
  },

  verifyPlacementCell: async (req, res) => {
    try {
      await PlacementCellService.verifyPlacementCell(req.params.id);
      handleSuccess(res, {
        message: 'Placement cell verified successfully'
      });
    } catch (error) {
      handleError(res, error);
    }
  }
};