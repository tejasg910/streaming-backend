import express from "express";
import {
  contact,
  courseReqeust,
  getDashboradStats,
} from "../controllers/otherController.js";
import { authorizedAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/contact").post(contact);
router.route("/courserequest").post(courseReqeust);

//admin status

router
  .route("/admin/stats")
  .get(isAuthenticated, authorizedAdmin, getDashboradStats);

export default router;
