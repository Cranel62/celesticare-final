export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

  // Strip stack traces in production environment
  const response = {
    status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};