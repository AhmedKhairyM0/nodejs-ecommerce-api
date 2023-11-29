const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,

  getUserData,
  updateUserData,
  changeMyPassword,
  deactivateUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");

const { protect } = require("../services/authService");

const {
  createUserValidator,
  changeMyPasswordValidator,
  changePasswordValidator,
} = require("../utils/validators/userValidator");

const authService = require("../services/authService");

const router = express.Router();

// Routes For Logged user
router.use(authService.protect);

router
  .route("/me")
  .get(getUserData, getUser)
  .patch(
    authService.checkEmailVerified,
    uploadUserImage,
    resizeImage,
    updateUserData,
    updateUser
  );

router.patch(
  "/changeMyPassword",
  authService.checkEmailVerified,
  changeMyPasswordValidator,
  protect,
  changeMyPassword
);

router.delete("/deactivate", deactivateUser);

// Routes For Admin
router.use(authService.restrictedTo("admin"));

router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(getUsers);

router
  .route("/:id")
  .get(getUser)
  .patch(uploadUserImage, resizeImage, updateUser)
  .delete(deleteUser);

router.patch("/changePassword/:id", changePasswordValidator, changePassword);

module.exports = router;
