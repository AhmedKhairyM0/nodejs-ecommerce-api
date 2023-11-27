const crypto = require("crypto");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const hashToken = require("../utils/hashToken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    password: {
      type: String,
      required: [true, "Password required"],
      minLength: [6, "Too short password"],
      select: false,
    },
    // confirmPassword: {
    //   type: String,
    //   required: [true, "Confirm password required"],
    //   select: false,
    // },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    phone: String,
    profileImage: String,
    active: {
      type: Boolean,
      default: true,
      // select: false,
    },
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
    changedPasswordAt: {
      type: Date,
      default: Date.now(),
    },
    passwordResetCode: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function async(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.changedPasswordAt = Date.now();
  }

  next();
});

userSchema.post(/^init|^save/, (doc) => {
  if (doc.profileImage) {
    const imageURL = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageURL;
  }

  if (!doc.active) {
    // eslint-disable-next-line no-delete-var
    doc = {};
    console.log(doc);
  }
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.methods.createEmailVerificationToken = async function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = hashToken(verificationToken);

  this.emailVerificationExpires =
    Date.now() + process.env.EMAIL_VERIFY_EXPIRE_TIME * 60 * 1000;

  await this.save();

  return verificationToken;
};

userSchema.methods.clearEmailVerificationToken = async function () {
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;

  await this.save();
};

module.exports = mongoose.model("User", userSchema);
