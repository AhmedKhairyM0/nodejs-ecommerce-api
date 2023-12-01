const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    ratings: {
      type: Number,
      required: [true, "Provide rating value for this review"],
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
    },
    content: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Provide user's review"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Provide product's review"],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
