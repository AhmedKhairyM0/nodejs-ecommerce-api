const sharp = require("sharp");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryService");
const Brand = require("../models/brandModel");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = catchAsync(async (req, res, next) => {
  const uniqueSuffix = Math.round(Math.random() * 1e12);
  const filename = `brand-${Date.now()}-${uniqueSuffix}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;

  next();
});

exports.createBrand = factory.createOne(Brand);

exports.getBrands = factory.getAll(Brand);

exports.getBrand = factory.getOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);
