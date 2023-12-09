const express = require("express");

const {
  addItemToCart,
  getCart,
  removeItemFromCart,
} = require("../services/cartService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.restrictedTo("user"));

router.route("/").post(addItemToCart).get(getCart);
router.route("/cartItems/:id").delete(removeItemFromCart);

module.exports = router;
