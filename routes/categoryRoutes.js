const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const authService = require("../services/authService");
const subCategoryRouter = require("./subCategoryRoutes");

const router = express.Router();

// mount subCategory routes
router.use("/:categoryId/subCategories", subCategoryRouter);

router
  .route("/")
  .post(
    authService.protect,
    authService.restrictedTo("admin"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get(getAllCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .patch(
    authService.protect,
    authService.restrictedTo("admin"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.restrictedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
