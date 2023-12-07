const express = require("express");

// const {
//   addProductToWishlistValidator,
// } = require("../utils/validators/wishlistValidator");

const {
  getUserAddresses,
  addUserAddress,
  removeUserAddress,
} = require("../services/addressService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.restrictedTo("user"));

router.route("/").get(getUserAddresses).post(addUserAddress);

router.route("/:addressId").delete(removeUserAddress);

module.exports = router;
