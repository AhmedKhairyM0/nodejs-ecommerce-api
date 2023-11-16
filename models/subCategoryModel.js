const mongoose = require("mongoose");
const slugifyPreSave = require("../middlewares/slugifyPreSave");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory must be required"],
      unique: true,
      trim: true,
      minlength: [2, "Too short SubCategory name"],
      maxlength: [32, "Too long SubCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must belong to parent category"],
    },
  },
  { timestamps: true }
);

subCategorySchema.pre("save", function (next) {
  slugifyPreSave(this.name, this);
  next();
});

subCategorySchema.post(/^init|^save/, (doc) => {
  const imageUrl = `${process.env.BASE_URL}/products/${doc.image}`;
  doc.image = imageUrl;
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
