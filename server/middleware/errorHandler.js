function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[ERROR] ${req.method} ${req.path} → ${status}: ${message}`);
  res.status(status).json({ error: { status, message } });
}

function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

module.exports = { errorHandler, createError };