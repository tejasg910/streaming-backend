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
import Mailjet from "node-mailjet";

// export const sendEmail = async (
//   from = "developertejas2405@gmail.com",
//   to,
//   subject,
//   text
// ) => {
//   const transporter = createTransport({
//     host: "smtp.elasticemail.com",
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: process.env.ELASTIC_USER_NAME,
//       pass: process.env.ELASTIC_PASS,
//       authMethod: "LOGIN",
//     },
//   });
//   await transporter.sendMail({
//     from,
//     to,
//     subject,
//     text,
//     html: text,
//   });
// };

export const sendEmail = async (
  from = "developertejas2405@gmail.com",
  to,
  subject,
  text
) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    text,
  };
  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent ");
    }
  });
};
