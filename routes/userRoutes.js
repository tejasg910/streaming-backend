import express from "express";
import { getAllCourses } from "../controllers/courseController.js";
import {
  changePassword,
  getMyProfile,
  login,
  logout,
  register,
  updateProfile,
  updateProfilePicture,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

//registration of new user
router.route("/register").post(register);

// login
router.route("/login").post(login);

//logout

router.route("/logout").get(logout);

//getmyprofile
router.route("/me").get(isAuthenticated, getMyProfile);

//changepassword

router.route("/changepassword").put(isAuthenticated, changePassword);

//updateprofile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

//update profile picture
router
  .route("/updateprofilepicture")
  .put(isAuthenticated, updateProfilePicture);

//forget passwoed

//reset password

//add to playlists

//remove from playlists

export default router;
