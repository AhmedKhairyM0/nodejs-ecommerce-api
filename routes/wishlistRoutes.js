const express = require("express");

const {
  addProductToWishlistValidator,
} = require("../utils/validators/wishlistValidator");

const {
  getUserWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
} = require("../services/wishlistService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.restrictedTo("user"));

router
  .route("/")
  .get(getUserWishlist)
  .post(addProductToWishlistValidator, addProductToWishlist);

router.route("/:productId").delete(removeProductFromWishlist);

module.exports = router;
