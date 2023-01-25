import express from "express";
import { getAllCourses } from "../controllers/courseController.js";
import { login, logout, register } from "../controllers/userController.js";

const router = express.Router();

//registration of new user
router.route("/register").post(register);

// login
router.route("/login").post(login);

//logout

router.route("/logout").get(logout);

//getmyprofile

//changepassword

//updateprofile picture

//forget passwoed

//reset password

//add to playlists

//remove from playlists

export default router;
