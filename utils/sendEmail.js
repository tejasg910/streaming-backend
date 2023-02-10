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
    secure: false, // true for 465, false for other ports
    auth: {
      user: "developertejas2405@gmail.com",
      pass: "DCDA69D393E46967621DB56A93C5F420BB48F6944A18F11D1E56C5C61ABCDC7E18C943B4DF066FE2A9EB0D2763E0C24E",
    },
  });
  await transporter.sendMail({
    to,
    subject,
    text,
  });
};
