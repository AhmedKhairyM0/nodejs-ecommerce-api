const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Product = require("../../models/productModel");
const Review = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("ratings")
    .notEmpty()
    .withMessage("Provide rating in your review")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be more than or equal to 1")
    .isLength({ max: 5 })
    .withMessage("Rating must be less than or equal to 5"),

  check("user")
    .notEmpty()
    .withMessage("Provide user's review")
    .isMongoId()
    .withMessage("Invalid user id format"),

  check("product")
    .notEmpty()
    .withMessage("Provide product's review")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom((productId) =>
      Product.findById(productId).then((product) => {
        if (!product) {
          return Promise.reject(
            new Error(`No found product with that id ${productId}`)
          );
        }
      })
    )
    .custom((productId, { req }) =>
      Review.findOne({ user: req.user.id, product: productId }).then(
        (review) => {
          console.log(`REVIEW VALIDATOt => req.user.id: ${req.user.id}`);
          if (review) {
            return Promise.reject(
              new Error("You already made a review before ")
            );
          }
        }
      )
    ),

  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((reviewId, { req }) =>
      Review.findById(reviewId).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(`No review found with that id ${reviewId}`)
          );
        }
        if (req.user.id !== review.user) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((reviewId, { req }) => {
      if (req.user.role === "user") {
        return Review.findById(reviewId).then((review) => {
          if (review && req.user.id !== review.user) {
            return Promise.reject(
              new Error("You are not allowed to perform this action")
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
