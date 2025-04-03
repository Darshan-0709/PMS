const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      type: decoded.type
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid token');
    }
    throw error;
  }
};

const authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.type)) {
      throw new UnauthorizedError('Unauthorized access');
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};