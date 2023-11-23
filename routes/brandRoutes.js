const express = require("express");

const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");

const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.restrictedTo("admin"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .patch(
    authService.protect,
    authService.restrictedTo("admin"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.restrictedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
