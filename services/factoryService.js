const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const APIFeatures = require("../utils/apiFeatures");

/**
 * @desc    Create a new resource
 * @route   /{resource}/
 */
exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);

    res.status(201).send({
      status: "success",
      data: doc,
    });
  });

/**
 * @desc    Get a list of resources
 * @route   /{resource}/
 */
exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // const docs = await Model.find();
    const apiFeatures = new APIFeatures(Model.find(), req.query)
      .paginate()
      .sort()
      .limitFields();
      
    const docs = await apiFeatures.query;

    res.status(200).send({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });

/**
 * @desc    Get a specific resource
 * @route   /{resource}/:id
 */
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);

    if (!doc) {
      return next(new ApiError(`No document with this id: ${id}`, 404));
    }

    res.status(200).send({
      status: "success",
      data: doc,
    });
  });

/**
 * @desc    Update a specific resource
 * @route   /{resource}/:id
 */
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!doc) {
      return next(new ApiError(`No document with this id: ${id}`, 404));
    }

    res.status(200).send({
      status: "success",
      data: doc,
    });
  });

/**
 * @desc    Delete a specific resource
 * @route   /{resource}/:id
 */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new ApiError(`No document with this id: ${id}`, 404));
    }

    res.status(204).send({
      status: "success",
      data: null,
    });
  });