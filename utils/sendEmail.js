import { createTransport } from "nodemailer";

// export const sendEmail = async (to, subject, text) => {
//   const transporter = createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });
//   await transporter.sendMail({
//     to,
//     subject,
//     text,
//   });
// };

export const sendEmail = async (to, subject, text) => {
  const transporter = createTransport({
    host: "smtp.elasticemail.com",
    port: 2525,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: "developertejas2405@gmail.com",
      pass: "B4F3CC33F7E6F9ACB24083FAD4CF1FF16963",
    },
  });
  await transporter.sendMail({
    from: "developertejas2405@gmail.com",
    to,
    subject,
    text,
  });
};
