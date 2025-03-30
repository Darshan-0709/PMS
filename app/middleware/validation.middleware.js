const Joi = require('joi');
const { ValidationError } = require('../utils/errors');

/**
 * Validate request against Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', or 'params')
 */
const validateRequest = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, '')
      }));
      
      throw new ValidationError('Validation failed', {
        details: errors
      });
    }

    next();
  };
};

module.exports = validateRequest;