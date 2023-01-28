import app from "./app.js";

import { connectDb } from "./config/connectDb.js";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";
connectDb();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
app.listen(process.env.PORT, () => {
  console.log("Server is working on", process.env.PORT);
});
