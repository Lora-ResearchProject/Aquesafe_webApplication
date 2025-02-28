exports.resetPasswordEmail = (name, resetLink) => {
  return `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <h2 style="color: #2563eb; font-size: 24px; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Hello ${name},
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to reset it:
          </p>
          <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-size: 16px;">
            Reset Password
          </a>
          <p style="font-size: 16px; line-height: 1.6;">
            If you didn't request this, please ignore this email. Your password will remain unchanged.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Best regards,<br />
            <strong>Aquasafe</strong>
          </p>
        </div>
      </div>
    `;
};

exports.newUserAccountEmail = (name, email, password) => {
  return `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
          <h2 style="color: #2563eb; font-size: 24px; margin-bottom: 20px;">Welcome to Aquasafe!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Hello ${name},
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Your account has been successfully created. Here are your login credentials:
          </p>
          <div style="background-color: #fff; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: left;">
            <p style="font-size: 16px; line-height: 1.6; margin: 0;">
              <strong>Email:</strong> ${email}
            </p>
            <p style="font-size: 16px; line-height: 1.6; margin: 0;">
              <strong>Password:</strong> ${password}
            </p>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">
            Please log in and change your password to a strong one for security reasons.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Best regards,<br />
            <strong>Aquasafe</strong>
          </p>
        </div>
      </div>
    `;
};
