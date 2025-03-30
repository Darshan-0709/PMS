class BaseError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
class ValidationError extends BaseError {
  constructor(message = 'Invalid input data') {
    super(message, 400);
  }
}

// 401 Unauthorized
class UnauthorizedError extends BaseError {
  constructor(message = 'Not authorized') {
    super(message, 401);
  }
}

// 403 Forbidden
class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// 404 Not Found
class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// 409 Conflict
class ConflictError extends BaseError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

// 500 Internal Server Error
class InternalServerError extends BaseError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

module.exports = {
  BaseError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError
};