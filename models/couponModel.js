// Coupons(id, code, productId, expiresIn, totalUsedNumber, currentUsedNumber, discountValue)
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    expiresIn: {
      type: Date,
      required: [true, "Coupon expiring time is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value is required"],
    },
    // totalUsedNumber: Number,
    // currentUsedNumber: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
