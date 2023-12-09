const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const ApiError = require("../utils/apiError");

/**
 * @desc    Add Product item to cart
 * @route   POST /api/v1/cart
 * @access  Protected/User
 */
exports.addItemToCart = catchAsync(async (req, res, next) => {
  const { productId, color, quantity } = req.body;

  // 1) Check if the product is exist
  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new ApiError("This product is not available now, try again later", 404)
    );
  }

  // 2) Check if the available product quantity
  if (product.quantity < quantity) {
    return next(
      new ApiError(
        `Not enough product in stock, available product quantity: ${product.quantity}`,
        400
      )
    );
  }

  // 3) Check if the available product colors
  if (!product.colors.includes(color)) {
    return next(
      new ApiError(
        `Not product with ${color} color, available colors: ${product.colors.join(
          ", "
        )}`,
        400
      )
    );
  }

  // 4) Get Cart of the logged user
  const { _id: userId } = req.user;
  let cart = await Cart.findOne({ user: userId });

  // 3) Check if the logged user doesn't have cart, then create new cart
  if (!cart) {
    cart = await Cart.create({
      cartItems: [
        { product: productId, color, quantity, price: product.price },
      ],
      totalPrice: product.price * quantity,
      user: userId,
    });
  } else {
    // 5) if user has cart, then add/update items at the cart
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    // TODO: When does product's quantity decrement?
    if (itemIndex > -1) {
      const cartItem = cart.cartItems[itemIndex];
      cart.totalPrice += product.price * (quantity - cartItem.quantity);
      cartItem.quantity = quantity;
      cart.cartItems[itemIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        quantity,
        price: product.price,
      });
      cart.totalPrice += product.price * quantity;
    }
    await cart.save();
  }

  return res.status(201).send({
    status: "success",
    data: cart,
  });
});
