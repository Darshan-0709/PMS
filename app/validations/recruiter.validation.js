const Joi = require("joi");

const recruiterSchema = Joi.object({
	company_name: Joi.string().max(100).required(),
	position: Joi.string().max(100).required(),
	description: Joi.string().optional(),
	website: Joi.string().uri().optional(),
	email: Joi.string().email().required(),
	is_verified: Joi.boolean().default(false),
});

// Middleware for validating recruiter data
const validateRecruiter = (req, res, next) => {
	const { error, value } = recruiterSchema.validate(req.body, {
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

module.exports = { validateRecruiter, recruiterSchema };
