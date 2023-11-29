const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createReviewValidator = [
  check("ratings")
    .notEmpty()
    .withMessage("Provide rating in your review")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be more than or equal to 1")
    .isLength({ max: 5 })
    .withMessage("Rating must be less than or equal to 5"),

  check("user")
    .notEmpty()
    .withMessage("Provide user's review")
    .isMongoId()
    .withMessage("Invalid user id format"),

  check("product")
    .notEmpty()
    .withMessage("Provide product's review")
    .isMongoId()
    .withMessage("Invalid product id format"),

  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];
