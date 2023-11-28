const jwt = require("jsonwebtoken");

const createToken = (newUser, expiresIn = process.env.JWT_EXPIRES_IN) =>
  jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn,
  });

module.exports = createToken;
