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
} = require("../services/reviewService");

const authService = require("../services/authService");

const router = express.Router();

router.get("/", getReviews);
router.get("/:id", getReviewValidator, getReview);

router.use(authService.protect);

router
  .route("/")
  .post(authService.restrictedTo("user"), createReviewValidator, createReview);

router
  .route("/:id")
  .patch(authService.restrictedTo("user"), updateReviewValidator, updateReview)
  .delete(
    // ً"user", "admin", "manager" لو
    // في الابلكشين عندي يبقا مافيش فايدة من اني احط سطر ذي ده roles  هما كل الـ??
    // authService.restrictedTo("user", "admin", "manager"), 
    deleteReviewValidator,
    deleteReview
  );
module.exports = router;
