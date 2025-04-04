const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sequelize,
  User,
  PlacementCell,
  Recruiter,
  Student,
} = require("../models");

// Student confirmation function
async function studentConfirmation(type, userData, profileData) {
  if (type === "student") {

    const emailDomain = "@" + userData.email.split("@")[1];

    if (!profileData.placement_cell_id) {
      throw new Error(
        "Placement Cell ID is required for student registration."
      );
    }

    // Fetch Placement Cell details
    const placementCell = await PlacementCell.findByPk(
      profileData.placement_cell_id
    );
    if (!placementCell) {
      throw new Error("Invalid Placement Cell ID.");
    }

    const allowedDomains = placementCell.domains || [];

    if (!allowedDomains.includes(emailDomain)) {
      throw new Error(
        `Email domain '${emailDomain}' is not allowed for this placement cell.`
      );
    }
  }
}

// Register User Function
exports.registerUser = async (type, userData, profileData) => {
  const transaction = await sequelize.transaction();
  try {
    if (type === "student") {
      await studentConfirmation(type, userData, profileData);
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const completeUserData = { ...userData, type, password: hashedPassword };
    const user = await User.create(completeUserData, { transaction });

    let profile;
    switch (type) {
      case "placement_cell":
        profile = await PlacementCell.create(
          { ...profileData, admin_id: user.user_id },
          { transaction }
        );
        break;
      case "recruiter":
        profile = await Recruiter.create(
          { ...profileData, representative_id: user.user_id },
          { transaction }
        );
        break;
      case "student":
        profile = await Student.create(
          { ...profileData, student_id: user.user_id },
          { transaction }
        );
        break;
      default:
        throw new Error(`Unsupported user type: ${type}`);
    }

    await transaction.commit();
    return { user, profile };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Registration failed: ${error.message}`);
  }
};

// Login User Function
exports.loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found.");


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password.");

    const token = generateAuthToken(user);
    return { user, token };
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

// Generate JWT Token
const generateAuthToken = (user) => {
  return jwt.sign(
    { userId: user.user_id, userType: user.type },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};
