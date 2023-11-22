const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const createToken = (newUser) =>
  jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, phone, profileImage } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    phone,
    profileImage,
  });

  const token = createToken(newUser);

  res.status(201).send({
    status: "success",
    token,
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // create token
  const token = createToken(user);

  // response with success status, token
  res.status(200).send({
    status: "success",
    token,
    data: user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return next(
      new ApiError("You are not login. Please, login to access this route", 401)
    );

  const token = authorization.split(" ")[1];
  if (!authorization.startsWith("Bearer") || !token) {
    return next(new ApiError("Invalid token format", 401));
  }

  const payload = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const user = await User.findById(payload.id);
  if (!user) {
    return next(new ApiError("This user is no longer exist", 401));
  }

  console.log(`user.changedPasswordAt: ${user.changedPasswordAt.getTime()}`);

  if (payload.iat < parseInt(user.changedPasswordAt.getTime() / 1000, 10)) {
    return next(
      new ApiError(
        "The password was recently changed, please log in again",
        401
      )
    );
  }

  req.user = user;
  console.log(req.user);
  next();
});

// roles: ["admin", "user"]
exports.restrictedTo =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.user.role)) return next();

    return next(new ApiError("You don't have permission for this action", 403));
  };

exports.logout = catchAsync((req, res) => {});

exports.verifyEmail = catchAsync((req, res) => {});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. current password for verifying if the user is authenticated
  const { currentPassword, password, confirmPassword } = req.body;

  console.log(req.user);
  const currentUser = await User.findOne(
    { email: req.user.email }
    // { password: 1 }
  ).select("password");

  const correctPassword = await bcrypt.compare(
    currentPassword,
    currentUser.password
  );

  if (!correctPassword) {
    return next(new ApiError("Current password is wrong"));
  }

  currentUser.password = password;
  await currentUser.save();

  res.status(200).send({
    status: "success",
    data: currentUser,
  });
  // User.findOneAndUpdate({ id: req.user.id }, { password, confirmPassword });
});

exports.forgotPassword = catchAsync((req, res) => {});

exports.resetPassword = catchAsync((req, res) => {});
