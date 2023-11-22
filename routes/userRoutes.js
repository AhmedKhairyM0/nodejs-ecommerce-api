const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  updateMe,
} = require("../services/userService");

const {
  signup,
  login,
  protect: isAuthenticated,
} = require("../services/authService");

const { createUserValidator } = require("../utils/validators/userValidator");

const router = express.Router();

// router.post("/signup", createUserValidator, signup);
// router.post("/login", login);
// router.patch("/updateMe/:id", uploadUserImage, resizeImage, updateMe);

// routes for admin
router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(getUsers);

router
  .route("/:id")
  .get(getUser)
  .patch(uploadUserImage, resizeImage, updateUser)
  .delete(deleteUser);

module.exports = router;
