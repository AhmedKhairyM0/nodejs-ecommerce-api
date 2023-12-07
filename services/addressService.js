const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.addUserAddress = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findByIdAndUpdate(
    id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).send({
    status: "success",
    data: user.addresses,
  });
});

exports.removeUserAddress = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { addressId } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    {
      $pull: { addresses: { _id: addressId } },
    },
    { new: true }
  );

  res.status(200).send({
    status: "success",
    data: user.addresses,
  });
});

exports.getUserAddresses = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  res.status(200).send({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
