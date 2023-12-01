const factory = require("./factoryService");
const Review = require("../models/reviewModel");

const populatedUser = { path: "user", select: "name profileImage -_id" };

exports.addLoggedUserID = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

/**
 * @desc In nested routes, we need to set product id from param to body
 * to perform the query in `HTTP POST /products/:productId/reviews`
 */
exports.setProductIdToBody = (req, res, next) => {
  if (req.params.productId) {
    req.body.product = req.params.productId;
  }
  next();
};

/**
 * @desc   In case nested routes, we need to set filter object with `productId`
 * that can use to filter reviews for specific product product
 * and this is beneficial in case nested routes `HTTP GET /products/:productId/reviews`
 */
exports.createFilterObject = (req, res, next) => {
  const { productId } = req.params;
  let filteredQuery = {};
  if (req.params.productId) filteredQuery = { product: productId };
  req.filterObj = filteredQuery;

  next();
};

/**
 * @desc    Create new review
 * @route   POST /api/v1/reviews
 * @access  Private/Protect/User
 */
exports.createReview = factory.createOne(Review);

/**
 * @desc    Get list reviews
 * @route   GET /api/v1/reviews
 * @access  Public
 */
exports.getReviews = factory.getAll(Review, populatedUser);

/**
 * @desc    Get specific review
 * @route   GET /api/v1/reviews/:id
 * @access  Public
 */
exports.getReview = factory.getOne(Review, populatedUser);

/**
 * @desc    Update specific review
 * @route   PATCH /api/v1/reviews/:id
 * @access  Private/Protect/User
 */
exports.updateReview = factory.updateOne(Review);

/**
 * @desc    Delete specific review
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private/Protect/User-Admin
 */
exports.deleteReview = factory.deleteOne(Review);
