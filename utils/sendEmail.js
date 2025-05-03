// utils/sendEmail.js
import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

const sendEmail = async (to, subject, text) => {
  if (!to || !subject || !text) {
    throw new ApiError(400, "Missing email parameters");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Support Team" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`📧 Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new ApiError(500, "Failed to send email");
  }
};

export default sendEmail;
