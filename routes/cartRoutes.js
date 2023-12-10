const express = require("express");

const {
  addItemToCart,
  getCart,
  removeItemFromCart,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.restrictedTo("user"));

router.route("/").post(addItemToCart).get(getCart).delete(clearCart);
router
  .route("/cartItems/:id")
  .delete(removeItemFromCart)
  .patch(updateCartItemQuantity);

router.post("/applyCoupon", applyCoupon);

module.exports = router;
