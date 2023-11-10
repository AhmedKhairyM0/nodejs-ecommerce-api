const catchAsync = require("../utils/catchAsync");
const SubCategory = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

exports.createSubCategory = catchAsync(async (req, res, next) => {
  // /api/v1/categories/:categoryId/subCategory/
  // /api/v1/subcategories/

  if (req.params.categoryId) req.body.category = req.params.categoryId;

  const { name, image, category } = req.body;

  const subCategory = await SubCategory.create({
    name,
    image,
    category,
  });

  res.status(201).send({
    status: "success",
    subCategory,
  });
});

// /api/v1/categories/:categoryId/subCategories/
// /api/v1/subCategories/
exports.getSubCategories = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  let filteredQuery = {};
  if (req.params.categoryId) filteredQuery = { category: categoryId };

  const subcategories = await SubCategory.find(filteredQuery);

  res.status(200).send({
    status: "success",

    data: {
      subcategories,
    },
  });
});

// /api/v1/categories/:categoryId/subCategories/:id
// /api/v1/subCategories/:id
exports.getSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);

  if (!subCategory) {
    return next(new ApiError(`No subCategory with this id: ${id}`, 404));
  }
  res.status(200).send({
    status: "success",
    subCategory,
  });
});

exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!subCategory) {
    return next(new ApiError(`No subCategory with this id: ${id}`, 404));
  }
  res.status(200).send({
    status: "success",
    subCategory,
  });
});

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id, { new: true });

  if (!subCategory) {
    return next(new ApiError(`No subCategory with this id: ${id}`, 404));
  }
  res.status(204).send({
    status: "success",
    subCategory,
  });
});
