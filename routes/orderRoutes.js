const express = require("express");

const { createCashOrder } = require("../services/orderService");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.restrictedTo("user"));

router.route("/").post(createCashOrder);

module.exports = router;
