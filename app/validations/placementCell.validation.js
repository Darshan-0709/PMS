const Joi = require('joi');

module.exports = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(3).max(100),
    branches: Joi.array().items(Joi.string().max(50)),
    website: Joi.string().uri(),
    contact_email: Joi.string().email()
  }),

  verifyPlacementCell: Joi.object({
    id: Joi.string().uuid().required()
  })
};