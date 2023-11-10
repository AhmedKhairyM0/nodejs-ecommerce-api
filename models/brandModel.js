const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: true,
      minLength: [2, "Too short brand name"],
      maxLength: [32, "Too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      required: [true, "Image required"],
    },
    // category: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Category",
    //   required: [true, "Category required"],
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
