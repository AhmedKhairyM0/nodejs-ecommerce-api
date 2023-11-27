const crypto = require("crypto");

const hashToken = function (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = hashToken;
