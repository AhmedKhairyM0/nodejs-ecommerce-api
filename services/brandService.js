const Brand = require("../models/brandModel");
const factory = require("./factoryService");

exports.createBrand = factory.createOne(Brand);

exports.getBrands = factory.getAll(Brand);

exports.getBrand = factory.getOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);
