const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const APIFeatures = require("../utils/apiFeatures");

/**
 * @desc    Create a new resource
 * @route   /resource
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
 * @route   /resource
 */
exports.getAll = (Model, popOption) =>
  catchAsync(async (req, res) => {
    const filter = req.filterObj || {};
    const apiFeatures = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .paginate()
      .sort()
      .limitFields();

    if (popOption) {
      apiFeatures.query.populate(popOption);
    }
    const docs = await apiFeatures.query;

    res.status(200).send({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });

/**
 * @desc    Get a specific resource
 * @route   /resource/:id
 */
exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const query = Model.findById(id);
    if (popOption) {
      query.populate(popOption);
    }
    const doc = await query;

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
 * @route   /resource/:id
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
