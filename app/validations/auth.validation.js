const Joi = require('joi');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

module.exports = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordRegex).required(),
    type: Joi.string().valid('student', 'placement_cell', 'recruiter').required(),
    
    // Student specific
    enrollment_number: Joi.when('type', {
      is: 'student',
      then: Joi.string().required()
    }),
    name: Joi.when('type', {
      is: 'student',
      then: Joi.string().required()
    }),
    
    // Placement Cell specific
    domain: Joi.when('type', {
      is: 'placement_cell',
      then: Joi.string().required()
    }),
    branches: Joi.when('type', {
      is: 'placement_cell',
      then: Joi.array().items(Joi.string()).min(1)
    }),
    
    // Recruiter specific
    company_name: Joi.when('type', {
      is: 'recruiter',
      then: Joi.string().required()
    }),
    position: Joi.when('type', {
      is: 'recruiter',
      then: Joi.string().required()
    })
  })
};