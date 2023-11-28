// This service is responsible for User CRUD operations with admin permission
const sharp = require("sharp");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryService");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

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

const filterAllowedFields = (req, ...allowedFields) => {
  const filterObj = {};
  allowedFields.forEach((field) => {
    if (req.body[field]) filterObj[field] = req.body[field];
  });

  return filterObj;
};

/*
 * @desc    Create user
 * @route   /api/v1/users
 * @access  Private/Admin
 */
exports.createUser = factory.createOne(User);

/*
 * @desc    Get list of the users
 * @route   /api/v1/users
 * @access  Private/Admin
 */
exports.getUsers = factory.getAll(User);

/*
 * @desc    Get Specific User
 * @route   /api/v1/users/:id
 * @access  Private/Admin
 */
exports.getUser = factory.getOne(User);

/*
 * @desc    Update any data for specific User
 * @route   /api/v1/users/:id
 * @access  Private/Admin
 */
exports.updateUser = factory.updateOne(User);

/*
 * @desc    Delete User
 * @route   /api/v1/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = factory.deleteOne(User);

/*
 * @desc    Change User password
 * @route   /api/v1/users/:id
 * @access  Private/Admin
 */
exports.changePassword = catchAsync(async (req, res, next) => {
  const { newPassword } = req.body;
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { password: newPassword },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("No found user with this id", 404));
  }

  res.status(200).send({
    status: "success",
    data: user,
  });
});

/*
 * @desc    Get logged user data
 * @route   /api/v1/users/me
 * @access  Private/Protect
 */
exports.getUserData = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

/*
 * @desc    Update logged user data
 * @route   /api/v1/users/me
 * @access  Private/Protect
 */
exports.updateUserData = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  req.body = filterAllowedFields(req, "name", "email", "phone", "profileImage");
  next();
});

/*
 * @desc    Change User password
 * @route   /api/v1/users/changeMyPassword
 * @access  Private/Protect
 */
exports.changeMyPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.user;

  const user = await User.findById(id).select("+password");

  if (!(await user.isCorrectPassword(currentPassword))) {
    return next(new ApiError("Current password is wrong"));
  }

  user.password = newPassword;
  await user.save();

  const token = createToken(user);

  res.status(200).send({
    status: "success",
    token,
    data: user,
  });
});

/*
 * @desc    Soft Delete or Deactivate user account
 * @route   /api/v1/users/deactivate
 * @access  Private/Protect
 */
exports.deactivateUser = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(`No User found with this id: ${id}`, 404));
  }

  res.status(204).send({
    status: "success",
    data: null,
  });
});
