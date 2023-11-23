const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const sendMail = require("../utils/email");

const User = require("../models/userModel");

const createToken = (newUser, expiresIn = process.env.JWT_EXPIRES_IN) =>
  jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn,
  });

const verifyToken = (token) =>
  promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

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

  const user = await User.findOne({ email }).select("+password");

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

  const payload = await verifyToken(token);

  const user = await User.findById(payload.id);
  if (!user) {
    return next(new ApiError("This user is no longer exist", 401));
  }

  if (payload.iat < parseInt(user.changedPasswordAt.getTime() / 1000, 10)) {
    return next(
      new ApiError(
        "The password was recently changed, please log in again",
        401
      )
    );
  }

  req.user = user;
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
  const { currentPassword, newPassword } = req.body;

  const currentUser = await User.findOne(
    { email: req.user.email },
    { password: 1 }
  );
  // .select("password");

  const correctPassword = await bcrypt.compare(
    currentPassword,
    currentUser.password
  );

  if (!correctPassword) {
    return next(new ApiError("Current password is wrong"));
  }

  currentUser.password = newPassword;
  await currentUser.save();

  const token = createToken(currentUser);

  res.status(200).send({
    status: "success",
    token,
    data: currentUser,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(ApiError("No found user with that email", 401));
  }

  const resetPasswordToken = createToken(user, "10m");

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetPasswordToken}`;

  const message = `Forgot your password? Submit this link to change your password, and provide new password, confirm it ${resetUrl}\n If you don't forget your password, please ignore this message.`;

  try {
    await sendMail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).send({
      status: "success",
      message: "Token is sent",
    });
  } catch (err) {
    return next(new ApiError(err, 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  const payload = await verifyToken(resetToken);

  const user = await User.findById(payload.id);

  if (!user) {
    return next(new ApiError("No found User with that id", 404));
  }
  user.password = password;
  await user.save();

  res.status(200).send({
    status: "success",
    data: user,
  });
});
