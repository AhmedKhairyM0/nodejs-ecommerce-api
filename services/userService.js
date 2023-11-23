// This service is responsible for User CRUD operations with admin permission
const sharp = require("sharp");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryService");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeImage = catchAsync(async (req, res, next) => {
  if (req.file) {
    const uniqueSuffix = Math.round(Math.random() * 1e12);
    const filename = `user-${Date.now()}-${uniqueSuffix}.jpeg`;

    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImage = filename;
  }

  next();
});

const filterAllows = (req, ...allowedFields) => {
  const filterObj = {};
  allowedFields.forEach((field) => {
    if (req.body[field]) filterObj[field] = req.body[field];
  });

  return filterObj;
};

/*
 * @desc    Get logged user data
 * @route   /api/v1/users/me
 * @access  Private
 */
exports.getUserData = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);

  res.status(200).send({
    status: "success",
    data: user,
  });
});

/*
 * @desc    Update logged user data
 * @route   /api/v1/users/me
 * @access  Private
 */
exports.updateUserData = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const filterObj = filterAllows(req, "name", "email", "phone", "profileImage");

  const user = await User.findByIdAndUpdate(id, filterObj, { new: true });

  if (!user) {
    return next(new ApiError("No found User with that id"));
  }

  res.status(200).send({
    status: "success",
    data: user,
  });
});

exports.createUser = factory.createOne(User);

exports.getUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
