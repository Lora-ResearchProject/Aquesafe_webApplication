const nodemailer = require("nodemailer");

// Constants
const MAX_RETRIES = 3; // Maximum number of retries for transient errors

// Function to send an email
exports.sendEmail = async ({to, subject, text, html, retryCount = 0}) => {
  try {
    // Create a transporter object using Titan Email's SMTP settings
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Titan Email's SMTP server
      port: process.env.EMAIL_PORT, // SMTP port for SSL
      secure: false, // Use SSL (true for 465, false for other ports)
      auth: {
        user: process.env.EMAIL_USER, // Your Titan Email address
        pass: process.env.EMAIL_PASSWORD, // Your Titan Email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS, // Sender address
      to: to, // List of recipients
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html, // HTML body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);

    // Error handling
    if (retryCount < MAX_RETRIES && error.code === "ECONNECTION") {
      // Retry for connection errors
      console.log(`Retrying... Attempt ${retryCount + 1}`);
      return await sendEmail(to, subject, text, html, retryCount + 1);
    } else if (error.code === "EAUTH") {
      // Handle authentication errors
      throw new Error(
        "Email authentication failed. Please check your email credentials."
      );
    } else if (error.code === "EENVELOPE") {
      // Handle envelope errors
      throw new Error(
        "Invalid recipient email address. Please check the email field."
      );
    } else {
      // Generic error handling
      throw new Error(
        "An error occurred while sending the email. Please try again later."
      );
    }
  }
};
