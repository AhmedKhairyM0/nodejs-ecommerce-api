const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database connected successfully: ${conn.connection.host}`);
  });
};

module.exports = dbConnect;
