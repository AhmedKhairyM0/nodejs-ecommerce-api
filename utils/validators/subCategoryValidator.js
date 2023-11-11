const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name"),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must belong to a category")
    .isMongoId()
    .withMessage("Invalid category id format"),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id format"),
  validatorMiddleware,
];
