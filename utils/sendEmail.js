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

export const sendEmail = async (
  from = "developertejas2405@gmail.com",
  to,
  subject,
  text
) => {
  const transporter = createTransport({
    host: "smtp.elasticemail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.ELASTIC_USER_NAME,
      pass: process.env.ELASTIC_PASS,
      authMethod: "LOGIN",
    },
  });
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: text,
  });
};
