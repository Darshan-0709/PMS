/**
 * Standardized success response handler
 * @param {Response} res - Express response object
 * @param {Object} options - Response options
 * @param {number} [options.statusCode=200] - HTTP status code
 * @param {string} [options.message='Success'] - Response message
 * @param {Object} [options.data={}] - Response data
 * @param {Object} [options.metadata={}] - Additional metadata
 */
const handleSuccess = (res, {
  statusCode = 200,
  message = 'Success',
  data = {},
  metadata = {}
}) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...metadata
  });
};

/**
 * Standardized error response handler
 * @param {Response} res - Express response object
 * @param {Error} error - Error object
 */
const handleError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const errorDetails = process.env.NODE_ENV === 'development' ? {
    stack: error.stack,
    fullError: error
  } : {};

  res.status(statusCode).json({
    success: false,
    message,
    ...errorDetails
  });
};

module.exports = {
  handleSuccess,
  handleError
};