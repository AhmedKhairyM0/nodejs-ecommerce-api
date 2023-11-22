const ApiError = require("../utils/apiError");

function devErrorHandler(res, err) {
  res.status(err.statusCode).send({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

const prodErrorHandler = (res, err) => {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
  });
};

const handleJwtInvalidSignatureError = () =>
  new ApiError("Invalid token, please login again", 401);

const handleExpiredJwtError = () =>
  new ApiError("Expired your token, please login again", 401);

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Something went wrong";

  if (process.env.NODE_ENV === "development") {
    devErrorHandler(res, err);
  } else {
    if (err.name === "JsonWebTokenError")
      err = handleJwtInvalidSignatureError();

    if (err.name === "TokenExpiredError") err = handleExpiredJwtError();

    prodErrorHandler(res, err);
  }
};

module.exports = globalErrorHandler;
