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

const router = express.Router();

router
  .route("/")
  .post(uploadProductImages, resizeImage, createProductValidator, createProduct)
  .get(getProducts);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .patch(
    uploadProductImages,
    resizeImage,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
