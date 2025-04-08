const { PlacementCell, Recruiter, Student } = require("../models");
const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("../utils/errors");

const authenticate = (req, res, next) => {
	try {
		const authHeader = req.headers?.authorization || undefined;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedError("Authentication token missing");
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			throw new UnauthorizedError("Authentication token missing");
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = {
			userId: decoded.userId,
			type: decoded.userType
		};

		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			throw new UnauthorizedError("Token expired");
		}
		if (error.name === "JsonWebTokenError") {
			throw new UnauthorizedError("Invalid token");
		}
		throw error;
	}
};

const authorize = (...allowedTypes) => {
	return (req, res, next) => {
		if (!allowedTypes.includes(req.user.type)) {
			throw new UnauthorizedError("Unauthorized access");
		}
		next();
	};
};

const checkOwnership = async (req, res, next) => {
	try {
		const { user } = req;
		const { resourceType, resourceId } = req.params; // Example: /drives/:resourceId

		if (user.type === "placement_cell") {
			// Placement Cell should only access its own resources
			const placementCell = await PlacementCell.findOne({
				where: { admin_id: user.userId }
			});

			if (!placementCell) {
				throw new UnauthorizedError(
					"Access denied: You are not a placement cell admin"
				);
			}

			// if (resourceType === "drive") {
			//   const drive = await Drive.findOne({
			//     where: { placement_cell_id: placementCell.placement_cell_id, drive_id: resourceId },
			//   });
			//   if (!drive) throw new UnauthorizedError("Access denied: Not your drive");
			// }

			// if (resourceType === "round") {
			//   const round = await Round.findOne({
			//     include: {
			//       model: Drive,
			//       where: { placement_cell_id: placementCell.placement_cell_id },
			//     },
			//     where: { round_id: resourceId },
			//   });
			//   if (!round) throw new UnauthorizedError("Access denied: Not your round");
			// }
		} else if (user.type === "recruiter") {
			// Recruiters should only access rounds linked to them via multiple relations
			const recruiter = await Recruiter.findOne({
				where: { representative_id: user.userId }
			});

			if (!recruiter) {
				throw new UnauthorizedError("Access denied: You are not a recruiter");
			}

			// if (resourceType === "round") {
			//   const round = await Round.findOne({
			//     include: {
			//       model: Drive,
			//       include: {
			//         model: Recruiter,
			//         where: { recruiter_id: recruiter.recruiter_id },
			//       },
			//     },
			//     where: { round_id: resourceId },
			//   });

			//   if (!round) throw new UnauthorizedError("Access denied: Not your round");
			// }
		}

		next();
	} catch (error) {
		res.status(403).json({ success: false, message: error.message });
	}
};

const authorizeStudentActions = async (req, res, next) => {
	try {
		const { user } = req; // Extracted from JWT in authenticate middleware
		const { id: studentId } = req.params;

		// Fetch student details from DB
		// Restore wont work if we are using soft delete
		// const student = await Student.findByPk(studentId, );
		const student = await Student.findByPk(studentId, { paranoid: false });
		if (!student) {
			return res
				.status(404)
				.json({ success: false, message: "Student not found" });
		}

		// If the user is the student themselves, allow access
		if (user.userId === student.student_id) {
			return next();
		}
		// If the user is a placement cell admin, check if the student belongs to their cell
		if (user.type === "placement_cell") {
			const placementCell = await PlacementCell.findOne({
				where: { admin_id: user.userId }
			});
			if (
				placementCell &&
				placementCell.placement_cell_id === student.placement_cell_id
			) {
				return next();
			}
		}

		// If none of the conditions match, deny access
		throw new ForbiddenError(
			"Access denied: Unauthorized to perform this action"
		);
	} catch (error) {
		res
			.status(error.status || 500)
			.json({ success: false, message: error.message });
	}
};

const authorizePlacementCellActions = async (req, res, next) => {
	try {
		const { user } = req; // Extracted from JWT in authenticate middleware
		const { id: placementCellId } = req.params;

		// Fetch placement cell details from DB
		const placementCell = await PlacementCell.findByPk(placementCellId, {
			paranoid: false
		});
		if (!placementCell) {
			return res
				.status(404)
				.json({ success: false, message: "Placement cell not found" });
		}

		// If the user is the placement cell admin, allow access
		console.log({ userId: user.userId });
		console.log({ placementCellId: placementCell.userId });
		if (user.userId === placementCell.admin_id) {
			return next();
		}
		// If the user is a representative of the placement cell, allow access
		if (user.userId === placementCell.representative_id) {
			return next();
		}

		// If none of the conditions match, deny access
		throw new ForbiddenError(
			"Access denied: Unauthorized to perform this action on this placement cell"
		);
	} catch (error) {
		res
			.status(error.status || 500)
			.json({ success: false, message: error.message });
	}
};

const authorizeRecruiterActions = async (req, res, next) => {
	try {
		const { user } = req; // Extracted from JWT in authenticate middleware
		const { id: recruiterId } = req.params;

		// Fetch recruiter details from DB
		const recruiter = await Recruiter.findByPk(recruiterId, {
			paranoid: false
		});

		if (!recruiter) {
			return res
				.status(404)
				.json({ success: false, message: "Recruiter not found" });
		}

		// If the user is the recruiter representative, allow access
		if (user.userId === recruiter.representative_id) {
			return next();
		}
		console.log({ user: user.userId, recruiter: recruiter.representative_id });
		// If none of the conditions match, deny access
		throw new ForbiddenError(
			"Access denied: Unauthorized to perform this action on this recruiter"
		);
	} catch (error) {
		res
			.status(error.status || 500)
			.json({ success: false, message: error.message });
	}
};

module.exports = {
	authenticate,
	authorize,
	checkOwnership,
	authorizeStudentActions,
	authorizePlacementCellActions,
	authorizeRecruiterActions
};
