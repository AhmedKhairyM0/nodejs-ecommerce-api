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
} = require("../services/reviewService");

const authService = require("../services/authService");

const router = express.Router();

router.get("/", getReviews);
router.get("/:id", getReviewValidator, getReview);

router.use(authService.protect);

router
  .route("/")
  .post(
    authService.restrictedTo("user"),
    addLoggedUserID,
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
