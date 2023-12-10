const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.addProductToWishlist = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      $addToSet: { wishlist: productId },
    },
    { new: true }
  );

  res.status(200).send({
    status: "success",
    data: user.wishlist,
  });
});

exports.removeProductFromWishlist = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    {
      $pull: { wishlist: productId },
    },
    { new: true }
  );

  res.status(200).send({
    status: "success",
    data: user.wishlist,
  });
});

exports.getUserWishlist = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id).populate("wishlist");

  res.status(200).send({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
