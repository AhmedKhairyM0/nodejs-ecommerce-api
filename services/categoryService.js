const Category = require("../models/categoryModel");
const factory = require("./factoryService");

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
