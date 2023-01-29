import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendEmail } from "../utils/sendEmail.js";

export const contact = catchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;
  const to = process.env.MY_MAIL;

  const subject = "Contact from streaming";
  const text = `I am ${name} and my email is${email}.\n ${message}`;
  await sendEmail(to, subject, text);

  res
    .status(200)
    .json({ success: true, message: "your message has been to the email" });
});

export const courseReqeust = catchAsyncError(async (req, res, next) => {
  const { name, email, course } = req.body;
  const to = process.env.MY_MAIL;

  const subject = "Requesting a course from streaming";
  const text = `I am ${name} and my email is${email}.\n ${course}`;
  await sendEmail(to, subject, text);

  res
    .status(200)
    .json({
      success: true,
      message: "your message has been sent to the email",
    });
});

export const getDashboradStats = catchAsyncError(async (req, res, next) => {});
