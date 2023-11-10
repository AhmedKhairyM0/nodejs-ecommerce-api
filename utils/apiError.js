/**
 * @desc   The `ApiError` class is a custom error class for responsing suitably errors in API requests
 * */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
}

module.exports = ApiError;
