const mongoose = require("mongoose");
const slugifyPreSave = require("../middlewares/slugifyPreSave");

const Category = require("./categoryModel");
const SubCategory = require("./subCategoryModel");
const Brand = require("./brandModel");
const ApiError = require("../utils/apiError");

// name, description, colors, images, price, discountPrice, quantity, brand, category, subcategories, reviews, coupons
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title required"],
      minLength: [5, "Too short product title"],
      maxLength: [100, "Too long product title"],
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minLength: [10, "Too short product description"],
      maxLength: [1000, "Too long product description"],
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    price: {
      type: Number,
      min: [0, "Invalid value for price"],
      required: [true, "Product price is required"],
    },
    priceAfterDiscount: Number,
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratingAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
      // required: [true, "Brand required"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
        
        // required: [true, "Subcategories required"],
      },
    ],
  },
  { timestamps: true }
);

// productSchema.index({ subcategories: { unique: true, dropDups: true } });

productSchema.pre("save", function (next) {
  slugifyPreSave(this.title, this);
  next();
});

productSchema.post(/^init|^save/, (doc) => {
  const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  doc.imageCover = imageUrl;
});

module.exports = mongoose.model("Product", productSchema);