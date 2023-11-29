const express = require("express");

const {
  signup,
  activateAccountVerification,
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
  forgotPasswordValidator,
  verifyPassResetCodeValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signup, activateAccountVerification);
router.post(
  "/activateAccountVerification",
  protect,
  activateAccountVerification
);
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
