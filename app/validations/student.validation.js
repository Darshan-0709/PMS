const Joi = require("joi");

const studentSchema = Joi.object({
  // student_id: Joi.string().uuid().required(),
  enrollment_number: Joi.string().max(50).optional(),
  placement_cell_id: Joi.string().uuid().optional(),
  name: Joi.string().max(100).optional(),
  degree: Joi.string().max(100).optional(),
  cgpa: Joi.number().min(0).max(10).precision(2).optional(),
  bachelors_gpa: Joi.number().min(0).max(10).precision(2).optional(),
  tenth_percentage: Joi.number().min(0).max(100).precision(2).optional(),
  twelfth_percentage: Joi.number().min(0).max(100).precision(2).optional(),
  diploma_percentage: Joi.number().min(0).max(100).precision(2).optional(),
  backlogs: Joi.number().integer().min(0).default(0),
  live_backlogs: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid("placed", "not placed").default("not placed"),
});

// Middleware for validating student data
const validateStudent = (req, res, next) => {
  const { error, value } = studentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message.replace(/['"]+/g, ""),
      })),
    });
  }

  req.body = value;
  next();
};

module.exports = { validateStudent, studentSchema };
