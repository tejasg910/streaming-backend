import express from "express";
import { config } from "dotenv";
config({
  path: "./config/config.env",
});
const app = express();

// using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import course from "./routes/CourseRoutes.js";
import user from "./routes/userRoutes.js";
import ErrorMiddleWare from "./middlewares/Error.js";

app.use("/api/v1", course);

app.use("/api/v1", user);

export default app;

app.use(ErrorMiddleWare);
