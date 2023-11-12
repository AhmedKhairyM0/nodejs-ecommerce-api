const Product = require("../models/productModel");
const factory = require("./factoryService");

exports.createProduct = factory.createOne(Product);

exports.getProducts = factory.getAll(Product, "category subcategories");

exports.getProduct = factory.getOne(Product, "category subcategories");

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
