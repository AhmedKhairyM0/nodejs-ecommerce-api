const express = require("express");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeImage,
} = require("../services/productService");

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.restrictedTo("admin"),
    uploadProductImages,
    resizeImage,
    createProductValidator,
    createProduct
  )
  .get(getProducts);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .patch(
    authService.protect,
    authService.restrictedTo("admin"),
    uploadProductImages,
    resizeImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.restrictedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
