const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
const databaseConnect = require("../../config/databaseConnection");
const Product = require("../../models/productModel");

dotenv.config({ path: "./config.env" });

databaseConnect();

// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Database connection successful!!"))
//   .catch((err) => console.log(`Database Error: ${err}`));

const importData = async () => {
  try {
    console.log("Reading Products data from json file!");
    const products = JSON.parse(
      fs.readFileSync(path.join(__dirname, "/products.json"))
    );
    await Product.create(products);
    console.log("Data added successfully!".green.inverse);
  } catch (err) {
    console.log(`Data Error: ${err}`.red.inverse);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data deleted successfully!".green.inverse);
  } catch (err) {
    console.log(`Data Error: ${err}`.red.inverse);
  }
  process.exit();
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
