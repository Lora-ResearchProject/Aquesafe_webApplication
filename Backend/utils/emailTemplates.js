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

exports.sosAlertEmail = (vesselName, lat, lng, dateTime) => {
  return `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ffefef; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e3342f;">
          <h2 style="color: #e3342f; font-size: 24px; margin-bottom: 20px;">🚨 URGENT: SOS Alert from Vessel ${vesselName} 🚨</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            An <strong>emergency SOS alert</strong> has been triggered by <strong>${vesselName}</strong>. Immediate attention is required!
          </p>
          ${
            lat && lng
              ? `<p style="font-size: 16px; line-height: 1.6;">
                  <strong>Last Known Location:</strong> ${lat}, ${lng}
                </p>`
              : ""
          }
          <p style="font-size: 16px; line-height: 1.6;">
            <strong>Alert Time:</strong> ${new Date(dateTime).toLocaleString()}
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #e3342f; font-weight: bold;">
            ⚠️ This is a critical situation. Immediate action is required to ensure the safety of the crew and vessel. ⚠️
          </p>
          ${
            lat && lng
              ? `<a href="https://www.google.com/maps?q=${lat},${lng}" 
                  style="display: inline-block; background-color: #e3342f; color: #fff; padding: 12px 24px; 
                  text-decoration: none; border-radius: 4px; margin: 20px 0; font-size: 16px;">
                  🗺️ View Location on Google Maps
                </a>`
              : ""
          }
          <p style="font-size: 16px; line-height: 1.6;">
            Please take immediate action and coordinate with the relevant authorities to respond to this emergency.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            For further assistance, contact the Aquasafe Team at <strong>+1-800-555-HELP</strong> or reply to this email.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Best regards,<br />
            <strong>Aquasafe Team</strong>
          </p>
        </div>
      </div>
    `;
};
