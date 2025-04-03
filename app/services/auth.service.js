// services/auth.service.js
const {
  sequelize,
  User,
  PlacementCell,
  Recruiter,
  Student,
} = require("../models");
const { all } = require("../routes/auth.routes");

async function studentConfirmation(type, userData, profileData) {
  if (type === "student") {
    console.log("Checking for student confirmation...");
    const emailDomain = "@" + userData.email.split("@")[1]; // Extracts 'university.edu' from 'student@university.edu'

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
    console.log("Raw domains from DB:", placementCell.domains);
    // Ensure allowed_domains is stored as JSON
    // const allowedDomains = JSON.parse(placementCell.domains || "[]");
    const allowedDomains = placementCell.domains || []; // Use the raw value directly

    console.log(allowedDomains, "Allowed Domains: ", allowedDomains);
    if (!allowedDomains.includes(emailDomain)) {
      throw new Error(
        `Email domain '${emailDomain}' is not allowed for this placement cell.`
      );
    }
  }
}

exports.registerUser = async (type, userData, profileData) => {
  const transaction = await sequelize.transaction();
  try {
    if (type === "student") {
      await studentConfirmation(type, userData, profileData);
    }
    // Create user with transaction
    const completeUserData = {
      ...userData,
      type: type, // Ensure type is included
    };
    const user = await User.create(completeUserData, { transaction });

    // Create placement cell with transaction
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
