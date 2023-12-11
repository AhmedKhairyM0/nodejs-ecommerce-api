const mongoose = require("mongoose");
const slugifyPreSave = require("../middlewares/slugifyPreSave");

// name, description, colors, images, price, discountPrice, quantity, brand, category, subcategories, reviews, coupons
// TODO: add quantity for each different size and color of product [{color, size, quantity}]
const productStockSchema = new mongoose.Schema({
  size: { type: String, enum: ["S", "M", "L", "XL"] },
  color: { type: String },
  quantity: { type: Number, default: 0 },
});

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
    stock: [productStockSchema],
    sold: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
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
      },
    ],
  },
  {
    timestamps: true,
    // To enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// productSchema.index({ subcategories: { unique: true, dropDups: true } });

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

productSchema.pre("save", function (next) {
  slugifyPreSave(this.title, this);
  next();
});

productSchema.post(/^init|^save/, (doc) => {
  if (doc.imageCover) {
    const imageCoverUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageCoverUrl;
  }

  if (doc.images) {
    const imagesUrls = doc.images.map((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      return imageUrl;
    });

    doc.images = imagesUrls;
  }
});

// TODO: remove unused images after update or delete for images is complete

module.exports = mongoose.model("Product", productSchema);
