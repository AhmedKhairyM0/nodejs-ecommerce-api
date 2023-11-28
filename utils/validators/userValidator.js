const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

// User validation middlewares
exports.createUserValidator = [
  check("name").notEmpty().withMessage("User name required"),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email")
    .custom((email) =>
      User.findOne({ email }).then((user) => {
        if (user) throw new Error("This email already exist");
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage("Weak password"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        return Promise.reject(new Error("The passwords do not match"));
      }
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"]) // ar-EG, /^ar/
    .withMessage("Invalid phone number"),

  validatorMiddleware,
];

exports.changeMyPasswordValidator = [
  check("currentPassword").notEmpty().withMessage("Old Password is required"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isStrongPassword()
    .withMessage("Weak password"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.newPassword) {
        return Promise.reject(new Error("The passwords do not match"));
      }
      return true;
    }),

  validatorMiddleware,
];

// Admin validation middlewares
exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid id"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isStrongPassword()
    .withMessage("Weak password"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.newPassword) {
        return Promise.reject(new Error("The passwords do not match"));
      }
      return true;
    }),

  validatorMiddleware,
];
