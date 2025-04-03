// middlewares/validate.js
const Joi = require("joi");

// Custom domain validator
const validateEmailDomain = (value, helpers) => {
  if (!value.startsWith("@")) return helpers.error("any.invalid");
  const domainPart = value.slice(1);
  if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domainPart))
    return helpers.error("any.invalid");
  return value;
};

// Schemas
const placementCellSchema = Joi.object({
  name: Joi.string().required(),
  domains: Joi.array()
    .items(Joi.string().custom(validateEmailDomain).required())
    .min(1)
    .required(),
  branches: Joi.array().items(Joi.string()).required(),
  website: Joi.string().uri(),
  email: Joi.string().email().required(),
});

const recruiterSchema = Joi.object({
  company_name: Joi.string().max(100).required(),
  position: Joi.string().max(100).required(), 
  description: Joi.string().optional(), 
  website: Joi.string().uri(), 
  email: Joi.string().email().required(),
});

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  type: Joi.string().valid("student", "placement_cell", "recruiter").required(),
  profileData: Joi.when("type", {
    is: "placement_cell",
    then: placementCellSchema.required(),
    otherwise: Joi.when("type", {
      is: "recruiter",
      then: recruiterSchema.required(),
      otherwise: Joi.forbidden(),
    }),
  }),
});

// Validation middleware
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
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

module.exports = {
  validate,
  schemas: { registerSchema },
};
