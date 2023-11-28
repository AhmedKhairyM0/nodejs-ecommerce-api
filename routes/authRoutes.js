const express = require("express");

const {
  signup,
  verifyEmail,
  login,
  protect,
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
router.patch("/activateAccount/:verificationToken", verifyEmail);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPasswordValidator, forgotPassword);
router.post(
  "/verifyResetCode",
  verifyPassResetCodeValidator,
  verifyResetPasswordCode
);
router.post("/resetPassword", protect, resetPasswordValidator, resetPassword);

module.exports = router;
