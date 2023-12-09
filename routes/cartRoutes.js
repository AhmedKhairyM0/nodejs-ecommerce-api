const express = require("express");

const { addItemToCart, getCart } = require("../services/cartService");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.restrictedTo("user"));

router.route("/").post(addItemToCart).get(getCart);

module.exports = router;
