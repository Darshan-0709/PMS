const Joi = require("joi");

const placementCellSchema = Joi.object({
	name: Joi.string().max(100).required(),
	domains: Joi.array()
		.items(
			Joi.string()
				.pattern(/^@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
				.required()
		)
		.required(),
	branches: Joi.array().items(Joi.string()).optional(),
	website: Joi.string().max(100).uri().optional(),
	email: Joi.string().email().optional(),
	is_verified: Joi.boolean().default(false),
	// admin_id: Joi.string().uuid().required(),
	representative_id: Joi.string().uuid().optional()
});

// Middleware for validating placement cell data
const validatePlacementCell = (req, res, next) => {
	const { error, value } = placementCellSchema.validate(req.body, {
		abortEarly: false,
		stripUnknown: true
	});

	if (error) {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
			errors: error.details.map((d) => ({
				field: d.path.join("."),
				message: d.message.replace(/['"]+/g, "")
			}))
		});
	}

	req.body = value;
	next();
};

module.exports = { validatePlacementCell, placementCellSchema };
