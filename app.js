import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
config({
  path: "./config/config.env",
});
const app = express();

// using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import course from "./routes/CourseRoutes.js";
import user from "./routes/userRoutes.js";
import ErrorMiddleWare from "./middlewares/Error.js";
import payment from "./routes/paymentroutes.js";
app.use("/api/v1", course);

app.use("/api/v1", user);
app.use("/api/v1", payment);

export default app;

app.use(ErrorMiddleWare);
