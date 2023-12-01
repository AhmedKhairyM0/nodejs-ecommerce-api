const express = require("express");

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  addLoggedUserID,
  createFilterObject,
  setProductIdToBody,
} = require("../services/reviewService");

const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });

router.get("/", createFilterObject, getReviews);
router.get("/:id", getReviewValidator, getReview);

router.use(authService.protect);

router
  .route("/")
  .post(
    authService.restrictedTo("user"),
    addLoggedUserID,
    setProductIdToBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .patch(authService.restrictedTo("user"), updateReviewValidator, updateReview)
  .delete(
    authService.restrictedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
