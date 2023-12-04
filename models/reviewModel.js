const mongoose = require("mongoose");
const Product = require("./productModel");

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

// Caculate the average ratings and quantity when the reviews is changed [create, update, delete]
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        ratingsAverage: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: +result[0].ratingsAverage.toFixed(2),
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatings(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  console.log(this.r.product);
  await this.r.constructor.calcAverageRatings(this.r.product);
});

module.exports = mongoose.model("Review", reviewSchema);
