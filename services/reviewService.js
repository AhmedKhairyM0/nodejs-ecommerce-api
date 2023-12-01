const factory = require("./factoryService");
const Review = require("../models/reviewModel");

exports.addLoggedUserID = (req, res, next) => {
  req.body.user = req.user.id;
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
exports.getReviews = factory.getAll(Review);

/**
 * @desc    Get specific review
 * @route   GET /api/v1/reviews/:id
 * @access  Public
 */
exports.getReview = factory.getOne(Review);

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
