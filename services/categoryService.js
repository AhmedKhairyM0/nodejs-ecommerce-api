const multer = require("multer");
const sharp = require("sharp");

const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const factory = require("./factoryService");
const Category = require("../models/categoryModel");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const uniqueSuffix = Math.round(Math.random() * 1e12);
  const filename = `category-${Date.now()}-${uniqueSuffix}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  req.body.image = filename;

  next();
});

/**
 * @desc    Create new category
 * @route   /api/v1/categories
 * @access  Private
 */
exports.createCategory = factory.createOne(Category);

/**
 * @desc    Get list of categories
 * @route   /api/v1/categories
 * @access  Piblic
 */
exports.getAllCategories = factory.getAll(Category);

/**
 * @desc    Get specific category
 * @route   /api/v1/categories/:id
 * @access  Public
 */
exports.getCategory = factory.getOne(Category);

/**
 * @desc    Update specific category
 * @route   /api/v1/categories/:id
 * @access  Private
 */
exports.updateCategory = factory.updateOne(Category);

/**
 * @desc    Delete specific category
 * @route   /api/v1/categories/:id
 * @access  Private
 */
exports.deleteCategory = factory.deleteOne(Category);
