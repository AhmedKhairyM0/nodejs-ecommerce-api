const express = require("express");
const morgan = require("morgan");

const ApiError = require("./utils/apiError");
const globalErrorHandler = require("./middlewares/errorMiddleware");

const categoryRouter = require("./routes/categoryRoutes");
const subCategoryRouter = require("./routes/subCategoryRoutes");
const brandRouter = require("./routes/brandRoutes");

const app = express();

// parser json middleware
app.use(express.json());

// logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`));
});

// Global error handler for express errors
app.use(globalErrorHandler);

module.exports = app;
