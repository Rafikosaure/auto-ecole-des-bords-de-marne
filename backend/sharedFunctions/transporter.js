const { createTransport } = require("nodemailer")
const ENV = require("../config/env").ENV


exports.transporter = createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: true, // use false for STARTTLS; true for SSL on port 465
    auth: {
        user: ENV.EMAIL_SENDER_ADDRESS,
        pass: ENV.GMAIL_APP_PASSWORD
    }
});