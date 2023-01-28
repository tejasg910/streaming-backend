import express from "express";
import {
  addLecture,
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseLectures,
} from "../controllers/courseController.js";
import { authorizedAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();
//get all course without lectures
router.route("/courses").get(isAuthenticated, getAllCourses);

//create new course only admin
router
  .route("/createcourse")
  .post(isAuthenticated, authorizedAdmin, singleUpload, createCourse);

//add lecture, delete course, get course details

router
  .route("/course/:id")
  .get(isAuthenticated, getCourseLectures)
  .post(isAuthenticated, authorizedAdmin, singleUpload, addLecture)
  .delete(isAuthenticated, authorizedAdmin, deleteCourse);
//delete lecture

export default router;
