const { promisify } = require("util");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const sendMail = require("../utils/email");
const hashToken = require("../utils/hashToken");
const User = require("../models/userModel");

const createToken = (newUser, expiresIn = process.env.JWT_EXPIRES_IN) =>
  jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn,
  });

const verifyToken = (token) =>
  promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

/*
 * @desc    Register new user
 * @route   POST  /api/v1/auth/signup
 * @access  Public
 */
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, profileImage } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    phone,
    profileImage,
  });

  const verificationToken = await user.createEmailVerificationToken();

  const message = `Verify your account in 1 hour with ${
    req.protocol
  }://${req.get("host")}/api/v1/auth/activateAccount/${verificationToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Email Verification (in 1 hour)",
      message,
    });

    res.status(201).send({
      status: "success",
      message: "Email Verification is sent to email",
    });
  } catch (err) {
    await user.clearEmailVerificationToken();

    return next(
      new ApiError("There is wrong in sending email verification", 500)
    );
  }
});

/*
 * @desc    Verify email to activate user's account
 * @route   POST  /api/v1/auth/activateAccount/:verificationToken
 * @access  Public
 */
exports.verifyEmail = catchAsync(async (req, res, next) => {
  // 1) Get verification token
  const { verificationToken } = req.params;
  const hashedVerificationToken = hashToken(verificationToken);

  // 2) Get user's verificationToken
  const user = await User.findOne({
    emailVerificationToken: hashedVerificationToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  // 3) Check if verification token is valid and not expired
  if (!user) {
    return next(
      new ApiError("Email verification token is invalid or expired", 401)
    );
  }

  // 4) Update user's account status to active
  user.isVerifiedEmail = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  res.status(200).send({
    status: "success",
    message: "Your account has been verified. You can login now",
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
  // 1) Check if token is correctly provided

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer"))
    return next(
      new ApiError("You are not login. Please, login to access this route", 401)
    );

  const token = authorization.split(" ")[1];

  // 2) Check if token is valid or is not expired
  const payload = await verifyToken(token);

  // 3) Check if user's id is exist
  const user = await User.findById(payload.id);
  if (!user) {
    return next(new ApiError("This user is no longer exist", 401));
  }
  // 4) Check if user's email is verified
  if (!user.isVerifiedEmail) {
    return next(
      new ApiError(
        "Your email is not still verified. Verify your email, please",
        401
      )
    );
  }

  // 5) Check if user had changed his password after token is signed
  if (user.changedPasswordAt) {
    const changedPasswordAt = parseInt(
      user.changedPasswordAt.getTime() / 1000,
      10
    );
    if (payload.iat < changedPasswordAt) {
      return next(
        new ApiError(
          "The password was recently changed, please log in again",
          401
        )
      );
    }
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

// exports.verifyEmail = catchAsync((req, res) => {});

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

/*
 * @desc    Forgot Password handler for beginning in the reset password process
 * @route   POST  /api/v1/auth/forgotPassword
 * @access  Public
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Check if user's email is exist
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError("No found user with that email", 404));
  }

  // 2) Create 6 digits reset code save it in DB with expiration date
  const resetCode = Math.floor(Math.random() * 900000 + 100000).toString();
  const passwordResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const expiresInMinutes = 10;
  user.passwordResetCode = passwordResetCode;
  user.passwordResetExpires = Date.now() + expiresInMinutes * 60 * 1000;
  await user.save();

  // 3) send the reset code at email
  const message = `Forgot your password? Use this reset code ${resetCode} to change your password.\nIf you didn't request this pin, we recommend you change your account password.`;

  try {
    await sendMail({
      email: user.email,
      subject: `Your password reset code (valid for ${expiresInMinutes} min)`,
      message,
    });

    res.status(200).send({
      status: "success",
      message: "The reset code of the reset password is sent",
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return next(
      new ApiError("There is error in sending the reset code email", 500)
    );
  }
});

/*
 * @desc    Verify Forgot Password handler for beginning in the reset password process
 * @route   POST  /api/v1/auth/verifyResetCode
 * @access  Public
 */
exports.verifyResetPasswordCode = catchAsync(async (req, res, next) => {
  // 1) Get the reset Code
  const { resetCode } = req.body;
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // 2) Check if there is user with the reset Code and not expired
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset Code is wrong or expired", 404));
  }

  // 3) Create & send jwt token to enable user form reset password
  const token = createToken(user);

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).send({
    status: "success",
    token,
  });
});

/*
 * @desc    Reset Password
 * @route   Patch  /api/v1/auth/resetPassword
 * @access  Private/Protect
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { user } = req;

  user.password = password;
  await user.save();

  res.status(200).send({
    status: "success",
    message: "Your password has been updated",
  });
});
