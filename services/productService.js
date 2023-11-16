const multer = require("multer");
const sharp = require("sharp");

const Product = require("../models/productModel");
const factory = require("./factoryService");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const catchAsync = require("../utils/catchAsync");

exports.uploadProductImage = uploadSingleImage("imageCover");

exports.resizeImage = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const uniqueSuffix = Math.round(Math.random() * 1e12);
  const filename = `product-${Date.now()}-${uniqueSuffix}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/products/${filename}`);

  req.body.imageCover = filename;

  next();
});

exports.createProduct = factory.createOne(Product);

exports.getProducts = factory.getAll(Product, "category subcategories");

exports.getProduct = factory.getOne(Product, "category subcategories");

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
