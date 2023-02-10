import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Not logged in", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded._id);

  next();
});

export const authorizedAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    next(new ErrorHandler(`${req.user.role} is not admin`), 403);
  }

  next();
};

export const authorizedSubscribers = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  if (req.user.subscription.status !== "active" || req.user.role !== "admin") {
    return next(
      new ErrorHandler(`${req.user.name} You are not active subscriber`),
      403
    );
  }

  next();
};
