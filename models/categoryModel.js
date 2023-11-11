const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const slugifyPreSave = function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    trim: true,
  });
  next();
};

categorySchema.pre("save", slugifyPreSave);

module.exports = mongoose.model("Category", categorySchema);
