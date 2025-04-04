// controllers/auth.controller.js
const { registerUser, loginUser } = require("../services/auth.service");

// controllers/auth.controller.js
exports.register = async (req, res) => {
  try {
    const { type, ...userData } = req.body;
    const profileData = req.body.profileData;

    const result = await registerUser(type, userData, profileData);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      data: result, // { user, token }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};
