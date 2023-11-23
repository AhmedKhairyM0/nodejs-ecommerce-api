const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");

const { createUserValidator } = require("../utils/validators/userValidator");

const authService = require("../services/authService");

const router = express.Router();

// routes for admin
router
  .route("/")
  .post(
    authService.protect,
    authService.restrictedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  )
  .get(authService.protect, authService.restrictedTo("admin"), getUsers);

router
  .route("/:id")
  .get(authService.protect, authService.restrictedTo("admin"), getUser)
  .patch(
    authService.protect,
    authService.restrictedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUser
  )
  .delete(authService.protect, authService.restrictedTo("admin"), deleteUser);

module.exports = router;
