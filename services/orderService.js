const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

/**
 * @desc    Create Cash order
 * @route   POST /api/v1/orders
 * @access  Protected/User
 */
exports.createCashOrder = catchAsync(async (req, res, next) => {
  // TODO: Get Tax and shipping prices
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get user's cart
  const { _id: userId } = req.user;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return next(new ApiError("User's cart is empty", 404));
  }

  // 2) Check if cart was applied by coupon?
  const cartPrice = cart.totalPriceAfterDiscount || cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create Order
  const order = await Order.create({
    userId,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  // 4) After creating order then decrement product quantity and increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product }, // , quantity: {$gte: item.quantity}
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption);

    // 5) Clear user's cart
    await Cart.findByIdAndDelete(cart._id);
  } else {
    return next(new ApiError("Error occured when creating order", 500));
  }

  res.status(200).send({
    status: "success",
    data: order,
  });
});
