import express from "express";
import { getAllCourses } from "../controllers/courseController.js";
import {
  addToPlayList,
  changePassword,
  deleteMyProfile,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getMyProfile,
  login,
  logout,
  register,
  removeFromPlayList,
  resetPassword,
  updateProfile,
  updateProfilePicture,
  updateUserRole,
} from "../controllers/userController.js";
import { authorizedAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

//registration of new user
router.route("/register").post(singleUpload, register);

// login
router.route("/login").post(login);

//logout

router.route("/logout").get(logout);

//getmyprofile
router
  .route("/me")
  .get(isAuthenticated, getMyProfile)
  .delete(isAuthenticated, deleteMyProfile);

//changepassword

router.route("/changepassword").put(isAuthenticated, changePassword);

//updateprofile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

//update profile picture
router
  .route("/updateprofilepicture")
  .put(isAuthenticated, singleUpload, updateProfilePicture);

//forget passwoed
router.route("/forgotpassword").post(forgotPassword);
//reset password
router.route("/resetpassword/:token").put(resetPassword);

//add to playlists
router.route("/addtoplaylist").post(isAuthenticated, addToPlayList);

//remove from playlists
router.route("/removefromplaylist").post(isAuthenticated, removeFromPlayList);

//admin routes

router.route("/admin/users").get(isAuthenticated, authorizedAdmin, getAllUsers);

router
  .route("/admin/user/:id")
  .put(isAuthenticated, authorizedAdmin, updateUserRole)
  .delete(isAuthenticated, authorizedAdmin, deleteUser);

export default router;
