// controllers/auth.controller.js
const authService = require("../services/auth.service");

// controllers/auth.controller.js
exports.register = async (req, res) => {
  try {
    const { type, ...userData } = req.body;
    const profileData = req.body.profileData;
    
    const result = await authService.registerUser(
      type,      
      userData,   
      profileData 
    );
    
    res.status(201).json({
      success: true,
      data: result
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};