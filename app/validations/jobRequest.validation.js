const Joi = require("joi");

const jobRequestSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().allow(""),
  salary: Joi.number().min(0).precision(2),
  location: Joi.string().max(255),
  job_type: Joi.string()
    .valid("full-time", "part-time", "internship")
    .required(),
  eligibility_criteria_id: Joi.string().uuid().required(),
  allowed_departments: Joi.array().items(Joi.string()).min(1).required(),
  status: Joi.string().valid("active", "closed"),
});

exports.validateJobRequest = (req, res, next) => {
  const { error } = jobRequestSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }
  next();
};
