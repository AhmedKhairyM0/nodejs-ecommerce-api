const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "production") {
    res.status(statusCode).send({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(statusCode).send({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

module.exports = globalErrorHandler;
