const path = require("path");

const express = require("express");
const morgan = require("morgan");

const ApiError = require("./utils/apiError");
const globalErrorHandler = require("./middlewares/errorMiddleware");

const mountRoutes = require("./routes");

const app = express();

// parser json middleware
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "uploads")));

// logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`));
});

// Global error handler for express errors
app.use(globalErrorHandler);

module.exports = app;
