const express = require("express");

const {
  addItemToCart,
  getCart,
  removeItemFromCart,
  clearCart,
} = require("../services/cartService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.restrictedTo("user"));

router.route("/").post(addItemToCart).get(getCart).delete(clearCart);
router.route("/cartItems/:id").delete(removeItemFromCart);

module.exports = router;
