const sharp = require("sharp");

const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryService");
const Product = require("../models/productModel");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeImage = catchAsync(async (req, res, next) => {
  console.log(req.files);
  if (req.files && req.files.imageCover) {
    const uniqueSuffix = Math.round(Math.random() * 1e12);
    const filename = `product-${Date.now()}-${uniqueSuffix}-cover.jpeg`;

    const imageCoverBuffer = req.files.imageCover[0].buffer;
    await sharp(imageCoverBuffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${filename}`);

    req.body.imageCover = filename;
  }

  if (req.files && req.files.images) {
    const productImages = req.files.images;
    req.body.images = [];
    productImages.forEach((image, index) => {
      const uniqueSuffix = Math.round(Math.random() * 1e12);
      const filename = `product-${Date.now()}-${uniqueSuffix}-${
        index + 1
      }.jpeg`;

      sharp(image.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${filename}`);
      req.body.images.push(filename);
    });
  }

  next();
});

exports.createProduct = factory.createOne(Product);

exports.getProducts = factory.getAll(Product, "category subcategories");

exports.getProduct = factory.getOne(Product, "category subcategories");

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
