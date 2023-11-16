const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const dbConnect = require("./config/databaseConnection");

const app = require("./app");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught exception: ${err.stack}`);
  process.exit(1);
});

// Database Connection
dbConnect();

// Server listening
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});

// Handle rejections outside of the express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection ${err}`);
  server.close(() => {
    console.error(`Shut down server`);
    process.exit(1);
  });
});

// TODO: Apply i10n
