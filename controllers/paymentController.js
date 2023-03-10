import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import crypto from "crypto";
import { instance } from "../server.js";
import { Payment } from "../models/Payment.js";
export const buySubscription = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return next(new ErrorHandler("Admin can not buy subscription", 400));
  }

  const plan_id = process.env.PLAN_ID || "plan_L9d93m47CknWdS";
  const subscription = await instance.subscriptions.create({
    plan_id,
    customer_notify: 1,

    total_count: 12,
  });

  user.subscription.id = subscription.id;
  user.subscription.status = subscription.status;
  await user.save();

  res.status(201).json({ success: true, subscriptionId: subscription.id });
});

export const paymetVefication = catchAsyncError(async (req, res, next) => {
  const { razorpay_signature, razorpay_subscription_id, razorpay_payment_id } =
    req.body;

  const user = await User.findById(req.user._id);
  const subscription_id = user.subscription.id;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
    .digest("hex");
  const isAuthentic = generatedSignature === razorpay_signature;

  if (!isAuthentic) {
    return res.redirect(`${process.env.FRONTEND_URL}/paymentfailed`);
  }

  //database comes here

  await Payment.create({
    razorpay_signature,
    razorpay_subscription_id,
    razorpay_payment_id,
  });

  user.subscription.status = "active";
  await user.save();
  res.redirect(
    `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
  );
});

export const getRazorpayKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

export const cancelSubscription = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const subscriptionId = user.subscription.id;
  const status = user.subscription.status;
  if (!subscriptionId) {
    return new ErrorHandler("No subscription id found", 404);
  }

  if (!status) {
    return new ErrorHandler("Your subscription is not active", 404);
  }

  let refund = false;
  try {
    const cancelledPayment = await instance.subscriptions.cancel(
      subscriptionId
    );

    const payment = await Payment.findOne({
      razorpay_subscription_id: subscriptionId,
    });

    const gap = Date.now() - payment.createdAt;
    const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;
    if (refundTime > gap) {
      await instance.payments.refund(payment.razorpay_payment_id);
      refund = true;
    }

    await payment.remove();
    user.subscription.id = undefined;
    user.subscription.status = undefined;

    await user.save();
    res.status(200).json({
      success: true,
      message: refund
        ? "subscription canceled successfully. You will receive your payment within 7 days"
        : "subscription canceled, no refund initiated as subscription was cancelled after 7 days.",
    });
  } catch (error) {
    return new ErrorHandler(error.message, 500);
  }
});
