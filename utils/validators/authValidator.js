const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
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

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email"),

  check("password")
    .notEmpty()
    .withMessage("Password is required"),
    
  validatorMiddleware,
];
