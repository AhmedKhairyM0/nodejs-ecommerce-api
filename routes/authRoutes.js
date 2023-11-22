const express = require("express");

const {
  signup,
  login,
  protect,
  updatePassword,
} = require("../services/authService");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signup);

router.post("/login", loginValidator, login);

router.patch("/updateMyPassword", protect, updatePassword);

module.exports = router;
