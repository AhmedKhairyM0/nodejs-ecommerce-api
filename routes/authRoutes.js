const express = require("express");

const {
  signup,
  login,
  protect,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyResetPasswordCode,
} = require("../services/authService");

const {
  signupValidator,
  loginValidator,
  updatePasswordValidator,
  forgotPasswordValidator,
  verifyPassResetCodeValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.patch(
  "/updateMyPassword",
  protect,
  updatePasswordValidator,
  updatePassword
);
router.post("/forgotPassword", forgotPasswordValidator, forgotPassword);
router.post("/verifyResetCode",verifyPassResetCodeValidator,verifyResetPasswordCode);
router.post("/resetPassword", protect, resetPasswordValidator, resetPassword);

module.exports = router;
