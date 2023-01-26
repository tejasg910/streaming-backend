import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  // const file  =req.file;

  if (!name || !email || !password)
    return next(new ErrorHandler("Please provide all fields", 404));

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("User already exists", 409));

  //upload file on cloudenary

  user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: "temp_id", url: "temp_url" },
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
  res
    .status(200)

    .json({
      success: true,

      message: "Profile picture updated successfully",
    });
});
