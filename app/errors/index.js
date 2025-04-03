// errors/index.js
class ApiError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', errors = []) {
    super(message, 400, errors);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  // Add other error types as needed
};