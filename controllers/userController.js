import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { Course } from "../models/Course.js";
import cloudinary from "cloudinary";
import { Stats } from "../models/Stats.js";
import getDataUri from "../utils/dataUri.js";

export const register = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  const file = req.file;
  console.log(file, "this is file");
  console.log(name, email, password);
  if (!name && !email && !password && !file)
    return next(new ErrorHandler("Please provide all fields", 404));

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("User already exists", 409));

  //upload file on cloudenary

  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: mycloud.public_id, url: mycloud.secure_url },
  });

  sendToken(res, user, "Registered successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // const file  =req.file;

  if (!email || !password)
    return next(new ErrorHandler("Please provide all fields", 404));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Incorrect email or password", 401));

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return next(new ErrorHandler("Incorrect email or password", 401));

  sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user);

  res
    .status(200)

    .json({
      success: true,

      user,
    });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("Please fill all fields", 400));
  const user = await User.findById(req.user).select("+password");
  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) return next(new ErrorHandler("Incorrect password", 401));

  user.password = newPassword;

  await user.save();

  res
    .status(200)

    .json({
      success: true,

      message: "Password changed successfully",
    });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user);
  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res
    .status(200)

    .json({
      success: true,

      message: "Profile updated successfully",
    });
});

//pending updateprofilepicture
export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const file = req.file;

  if (!user) return next(new ErrorHandler("User not found", 404));
  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  user.avatar = {
    public_id: mycloud.public_id,
    url: mycloud.secure_url,
  };

  await user.save();

  res
    .status(200)

    .json({
      success: true,

      message: "Profile picture updated successfully",
    });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 400));

  const resetToken = await user.getResetToken();
  await user.save();
  // send token via email
  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `Click on the link to reset your password. ${url}. If you have not requested please ignore`;
  await sendEmail(user.email, `course streaming reset password`, message);

  res
    .status(200)

    .json({
      success: true,

      message: `reset token has been sent to ${user.email}`,
    });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) return next(new ErrorHandler("token is invalid or expired", 400));

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  res
    .status(200)

    .json({
      success: true,

      message: "password changed successfully",
    });
});

export const addToPlayList = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findById(req.user.id);

  const course = await Course.findById(req.body.id);

  if (!course) return next(new ErrorHandler("Invalid course id", 404));
  const itemExists = user.playlist.find((item) => {
    if (item.course.toString() === course._id.toString()) return true;
  });

  if (itemExists)
    return next(new ErrorHandler("This course is already exists", 409));
  user.playlist.push({
    course: course._id,
    poster: course.poster.url,
  });

  await user.save();
  res
    .status(200)

    .json({
      success: true,

      message: "Added to playlist",
    });
});

export const removeFromPlayList = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findById(req.user.id);

  const course = await Course.findById(req.query.id);

  if (!course) return next(new ErrorHandler("Invalid course id", 404));

  user.playlist = user.playlist.filter((item) => {
    return item.course.toString() !== course._id.toString();
  });

  await user.save();
  res
    .status(200)

    .json({
      success: true,

      message: "Removed from playlist",
    });
});

//admin controllers

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});

  res
    .status(200)

    .json({
      success: true,

      users,
    });
});

export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("user not found"), 404);
  if (user.role === "admin") {
    user.role = "user";
  } else {
    user.role = "admin";
  }
  await user.save();

  res
    .status(200)

    .json({
      success: true,

      message: `You are now ${user.role}`,
    });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("user not found"), 404);
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  //cancel subscription

  await user.remove();

  res
    .status(200)

    .json({
      success: true,

      message: `User deleted successfully`,
    });
});

export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  //cancel subscription

  await user.remove();

  res
    .status(200)
    .cookie("token", null, { expires: new Date(Date.now()) })
    .json({
      success: true,

      message: `User deleted successfully`,
    });
});

User.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);
  const subscription = await User.find({ "subscription.status": "active" });
  stats[0].subscription = subscription.length;
  stats[0].users = await User.countDocuments();
  stats[0].createdAt = new Date(Date.now());
  await stats[0].save();
});
