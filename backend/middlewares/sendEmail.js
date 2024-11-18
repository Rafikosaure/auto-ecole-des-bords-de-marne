const nodemailer = require("nodemailer");
const { ENV } = require("../config/env.js")

/**
 * @async sends an email.
 * @param {object} option - email parameters.
 */
exports.sendEmail = async (option) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
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
      await transporter.sendMail(mailOption, (err, info) => {
        if (err) console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  };