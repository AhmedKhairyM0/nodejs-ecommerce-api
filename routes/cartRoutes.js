const express = require("express");

const { addItemToCart } = require("../services/cartService");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.restrictedTo("user"));

router.route("/").post(addItemToCart);

module.exports = router;
