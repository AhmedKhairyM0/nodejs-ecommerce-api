const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Product = require("../../models/productModel");

exports.addProductToWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Provide a product id")
    .isMongoId()
    .withMessage("Invalid product id")
    .custom((productId) =>
      Product.findById(productId).then((product) => {
        if (!product)
          return Promise.reject(new Error("This product is not found"));
      })
    ),

  validatorMiddleware,
];
