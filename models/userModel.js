const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    changedPasswordAt: {
      type: Date,
      default: Date.now(),
    },
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
// FIXME: what if doc.profileImage is undefined
userSchema.post(/^init|^save/, (doc) => {
  if (doc.profileImage) {
    const imageURL = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageURL;
  }
});

module.exports = mongoose.model("User", userSchema);
