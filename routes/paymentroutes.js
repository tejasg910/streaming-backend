import express from "express";
import {
  buySubscription,
  cancelSubscription,
  getRazorpayKey,
  paymetVefication,
} from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

//buy subscription

router.route("/subscribe").get(isAuthenticated, buySubscription);

//verify payment and save reference in databse
router.route("/paymentverification").post(isAuthenticated, paymetVefication);

// get razorpya key
router.route("/razorpaykey").get(getRazorpayKey);

//cancel subscription
router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);

export default router;
