const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const subCategoryRouter = require("./subCategoryRoutes");

const router = express.Router();

// mount subCategory routes
router.use("/:categoryId/subCategories", subCategoryRouter);

router
  .route("/")
  .post(createCategoryValidator, createCategory)
  .get(getAllCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .patch(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
