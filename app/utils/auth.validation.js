const Joi = require('joi');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

module.exports = {
  register: Joi.object({
    type: Joi.string().valid('student', 'placement_cell', 'recruiter').required()
      .messages({
        'any.required': 'User type is required',
        'any.only': 'Invalid user type'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string().pattern(passwordRegex).required()
      .messages({
        'string.pattern.base': 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
        'any.required': 'Password is required'
      }),
    // Student specific
    enrollment_number: Joi.when('type', {
      is: 'student',
      then: Joi.string().required().messages({
        'any.required': 'Enrollment number is required for students'
      })
    }),
    // Recruiter specific
    company_name: Joi.when('type', {
      is: 'recruiter',
      then: Joi.string().required().messages({
        'any.required': 'Company name is required for recruiters'
      })
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().pattern(passwordRegex).required()
  })
};