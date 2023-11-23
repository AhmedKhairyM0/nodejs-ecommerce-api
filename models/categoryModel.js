const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const slugifyPreSave = require("../middlewares/slugifyPreSave");

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

categorySchema.pre("save", function (next) {
  slugifyPreSave(this.name, this);
  next();
});

categorySchema.post(/^init|^save/, (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
});

module.exports = mongoose.model("Category", categorySchema);
