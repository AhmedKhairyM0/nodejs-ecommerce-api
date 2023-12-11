const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

const checkIfCategoryIsExist = (id) =>
  Category.findById(id).then((category) => {
    if (!category) {
      return Promise.reject(new Error("No category found with that id"));
    }
  });

const checkIfSubCategoryIsExist = (ids, { req }) =>
  SubCategory.find({ _id: { $in: ids }, category: req.body.category }).then(
    (subs) => {
      if (ids.length !== subs.length) {
        return Promise.reject(
          new Error(
            "Some subcategories ids were not found or do not belong to this category"
          )
        );
      }
    }
  );

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product is required")
    .isLength({ min: 5 })
    .withMessage("Too short product title")
    .isLength({ max: 100 })
    .withMessage("Too long product title"),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10 })
    .withMessage("Too short product description")
    .isLength({ max: 1000 })
    .withMessage("Too long product description"),

  check("imageCover").notEmpty().withMessage("Product image is required"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Discount price must be lower than price");
      }
      return true;
    }),

  check("stock")
    .notEmpty()
    .withMessage("Product Stock is required")
    .custom((stock) => {
      stock.forEach((item) => {
        if (!item.quantity) {
          throw new Error("Product quantity is required");
        }
        return true;
      });
    }),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be number"),

  // check("ratingAverage").isInt({min: 1, max: 5}).withMessage("Rating is between 1.0 and 5.0"),

  check("category")
    .notEmpty()
    .withMessage("Product must belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom(checkIfCategoryIsExist),

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategories id format")
    .custom(checkIfSubCategoryIsExist),

  check("brand").optional().isMongoId().withMessage("Invalid Brand id format"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),

  check("title")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Too short product title")
    .isLength({ max: 100 })
    .withMessage("Too long product title"),

  check("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Too short product description")
    .isLength({ max: 1000 })
    .withMessage("Too long product description"),

  check("imageCover")
    .optional()
    .notEmpty()
    .withMessage("Product image is required"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Discount price must be lower than price");
      }
      return true;
    }),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be number"),

  // check("ratingAverage").isInt({min: 1, max: 5}).withMessage("Rating is between 1.0 and 5.0"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category id format"),

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Brand id format"),

  check("brand").optional().isMongoId().withMessage("Invalid Brand id format"),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];
