const slugify = require("slugify");
const Category = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");

/**
 * @desc    Create new category
 * @route   /api/v1/categories
 * @access  Private
 */
exports.createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  const newCategory = await Category.create({ name, slug: slugify(name) });

  res.status(201).send({
    status: "success",
    data: newCategory,
  });
});

/**
 * @desc    Get list of categories
 * @route   /api/v1/categories
 * @access  Piblic
 */
exports.getAllCategories = catchAsync(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const categories = await Category.find().limit(limit).skip(skip);

  res.status(200).send({
    status: "success",
    results: categories.length,
    page,
    data: categories,
  });
});

/**
 * @desc    Get specific category
 * @route   /api/v1/categories/:id
 * @access  Public
 */
exports.getCategory = catchAsync(async (req, res, next) => {
  // by id
  const { id } = req.params;
  const category = await Category.findById(id);
  // by slug
  // const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return next(new ApiError(`No category with this id: ${id}`, 404));
  }

  res.status(200).send({
    status: "success",
    data: category,
  });
});

/**
 * @desc    Update specific category
 * @route   /api/v1/categories/:id
 * @access  Private
 */
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!category) {
    return next(new ApiError(`No category with this id: ${id}`, 404));
  }

  res.status(200).send({
    status: "success",
    data: category,
  });
});

/**
 * @desc    Delete specific category
 * @route   /api/v1/categories/:id
 * @access  Private
 */
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(`No category with this id: ${id}`, 404));
  }

  res.status(204).send({
    status: "success",
    data: null,
  });
});
