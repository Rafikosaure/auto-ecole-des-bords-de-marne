const nodemailer = require("nodemailer");
const { ENV } = require("../config/env.js")

/**
 * @async sends an email. Rejects if sending fails, so the caller can react
 * (the previous version swallowed all errors and always reported success).
 * @param {object} option - email parameters.
 */
exports.sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
      host: ENV.EMAIL_HOST,
      port: ENV.EMAIL_PORT,
      secure: true, // use false for STARTTLS; true for SSL on port 465
      auth: {
        user: ENV.EMAIL_SENDER_ADDRESS,
        pass: ENV.GMAIL_APP_PASSWORD,
      },
    });
    const mailOption = {
      from: ENV.EMAIL_SENDER_ADDRESS,
      to: option.email,
      subject: option.subject,
      html: option.message,
    };
    await transporter.sendMail(mailOption);
  };
