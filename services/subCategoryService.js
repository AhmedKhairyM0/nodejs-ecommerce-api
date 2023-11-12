const SubCategory = require("../models/subCategoryModel");
const factory = require("./factoryService");

/**
 * @description In nested routes, we need to set category id from param to body
 * to perform the query in `HTTP POST /categories/:categoryId/subcategories`
 */
exports.setCategoryIdToBody = (req, res, next) => {
  if (req.params.categoryId) {
    req.body.category = req.params.categoryId;
  }
  next();
};

/**
 * @description   In case nested routes, we need to set filter object with `categoryId`
 * that can use to filter subcategories by category
 * and this is beneficial in case nested routes `HTTP GET /categories/:categoryId/subcategories`
 */
exports.createFilterObject = (req, res, next) => {
  const { categoryId } = req.params;
  let filteredQuery = {};
  if (req.params.categoryId) filteredQuery = { category: categoryId };
  req.filterObj = filteredQuery;

  next();
};

// TODO: Check if category id is already exist and not
exports.createSubCategory = factory.createOne(SubCategory);

exports.getSubCategories = factory.getAll(SubCategory);

exports.getSubCategory = factory.getOne(SubCategory);

exports.updateSubCategory = factory.updateOne(SubCategory);

exports.deleteSubCategory = factory.deleteOne(SubCategory);
