const Joi = require("joi");

const eligibilityCriteriaSchema = Joi.object({
	name: Joi.string().max(100).required(),
	min_cgpa: Joi.number().min(0).max(10).precision(2).optional(),
	min_bachelors_gpa: Joi.number().min(0).max(10).precision(2).optional(),
	min_tenth_percentage: Joi.number().min(0).max(100).precision(2).optional(),
	min_twelfth_percentage: Joi.number().min(0).max(100).precision(2).optional(),
	min_diploma_percentage: Joi.number().min(0).max(100).precision(2).optional(),
	max_backlogs: Joi.number().integer().min(0).optional(),
	max_live_backlogs: Joi.number().integer().min(0).optional()
});

// Middleware for validating eligibility criteria data
const validateEligibilityCriteria = (req, res, next) => {
	const { error, value } = eligibilityCriteriaSchema.validate(req.body, {
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

module.exports = { validateEligibilityCriteria, eligibilityCriteriaSchema };
