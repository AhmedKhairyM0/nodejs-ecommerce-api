const nodemailer = require("nodemailer");
/**
 *
 * @param {*, email, subject, message} options
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: "Ahmed Khairy <ak@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
