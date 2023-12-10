const express = require("express");

const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.restrictedTo("admin", "manager"));

router.route("/").post(createCoupon).get(getCoupons);

router.route("/:id").get(getCoupon).patch(updateCoupon).delete(deleteCoupon);

module.exports = router;
