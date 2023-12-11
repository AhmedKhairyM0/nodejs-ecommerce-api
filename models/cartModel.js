const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        color: String,
        size: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamp: true }
);

cartSchema.methods.calcTotalPrice = function () {
  this.totalPrice = this.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
    this.totalPriceAfterDiscount = undefined;
};

module.exports = mongoose.model("Cart", cartSchema);
