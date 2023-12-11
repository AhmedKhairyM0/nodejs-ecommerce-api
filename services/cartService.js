const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Cart = require("../models/cartModel");

/**
 * @desc    Add Product item to cart
 * @route   POST /api/v1/cart
 * @access  Protected/User
 */
exports.addItemToCart = catchAsync(async (req, res, next) => {
  const { productId, color, size, quantity } = req.body;

  // 1) Check if the product is exist
  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new ApiError("This product is not available now, try again later", 404)
    );
  }

  // 2) Check if the available product quantity
  const itemStockIndex = product.stock.findIndex((item) => {
    let available = true;
    if (color && item.color) available = available && item.color === color;
    if (size && item.size) available = available && item.size === size;

    return available && +item.quantity >= quantity;
  });
  if (itemStockIndex === -1) {
    return next(
      new ApiError(
        `Not enough product in stock, available ${color} ${size} product quantity: ${product.stock[itemStockIndex]}`,
        400
      )
    );
  }

  // 3) Get Cart of the logged user
  const { _id: userId } = req.user;
  let cart = await Cart.findOne({ user: userId });

  // 4) Check if the logged user doesn't have cart, then create new cart
  if (!cart) {
    cart = new Cart({ cartItems: [], totalPrice: 0, user: userId });
  }

  // 5) if user has cart, then add/update items at the cart
  const itemIndex = cart.cartItems.findIndex((item) => {
    let available = item.product.toString() === productId;
    if (item.color && color) available = available && item.color === color;
    if (item.size && size) available = available && item.size === size;

    return available;
  });

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    // cart.totalPrice += product.price * (quantity - cartItem.quantity);
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    // FIXME: Wh
    cart.cartItems.push({
      product: productId,
      color: color || product.stock[itemStockIndex].color,
      size: size || product.stock[itemStockIndex].size,
      quantity,
      price: product.price,
    });
    // cart.totalPrice += product.price * quantity;
  }

  cart.calcTotalPrice();
  await cart.save();

  return res.status(201).send({
    status: "success",
    data: cart,
  });
});

/**
 * @desc    Get logged user's cart
 * @route   GET /api/v1/cart
 * @access  Protected/User
 */
exports.getCart = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user with id: ${userId}`, 404)
    );
  }

  res.status(200).send({
    status: "success",
    results: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/v1/cart/cartItems/:id
 * @access  Protected/User
 */
exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id: cartItemId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    {
      $pull: { cartItems: { _id: cartItemId } },
    },
    { new: true }
  );

  if (!cart) {
    return next(new ApiError("There is no cart for this user", 404));
  }

  cart.calcTotalPrice();
  await cart.save();

  res.status(200).send({
    status: "success",
    data: cart,
  });
});

/**
 * @desc    Remove cart
 * @route   DELETE /api/v1/cart
 * @access  Protected/User
 */
exports.clearCart = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;

  const cart = await Cart.findOneAndDelete({ user: userId });

  if (!cart) {
    return next(new ApiError("There is no cart for this user", 404));
  }

  res.status(204).send({
    status: "success",
    data: null,
  });
});

/**
 * @desc    Change the quantity of a specific cart item
 * @route   PATCH /api/v1/cart/cartItems/:id
 * @access  Protected/User
 */
exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id: cartItemId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(new ApiError("There is no cart for this user", 404));
  }

  const itemIndex = cart.cartItems.findIndex((item) => item.id === cartItemId);
  if (itemIndex > -1) {
    cart.cartItems[itemIndex].quantity = quantity;
  } else {
    return next(new ApiError("There is no cart item with this id", 404));
  }

  cart.calcTotalPrice();
  await cart.save();

  res.status(200).send({
    status: "success",
    results: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc    Apply Discount on the total price of the cart
 * @route   POST /api/v1/cart/applyCoupon
 * @access  Protected/User
 */
exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { coupon: couponName } = req.body;

  const coupon = await Coupon.findOne({
    name: couponName,
    expiresIn: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError("Coupon is invalid or expired", 404));
  }

  const cart = await Cart.findOne({ user: userId });

  cart.totalPriceAfterDiscount = (
    cart.totalPrice -
    cart.totalPrice * (coupon.discount / 100)
  ).toFixed(2);
  await cart.save();

  res.status(200).send({
    status: "success",
    data: cart,
  });
});
