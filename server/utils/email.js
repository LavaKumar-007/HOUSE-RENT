const nodemailer = require("nodemailer");

const clientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendEmail = async ({ to, subject, html, devLabel, devUrl }) => {
  const transporter = createTransporter();
  if (transporter) {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "HouseHunt <noreply@househunt.app>",
      to,
      subject,
      html,
    });
    return;
  }
  console.log(`\n--- ${devLabel} (dev mode) ---`);
  console.log(`To: ${to}`);
  console.log(`URL: ${devUrl}`);
  console.log("----------------------------\n");
};

const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${clientUrl()}/verify-email/${token}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your HouseHunt account",
    devLabel: "EMAIL VERIFICATION",
    devUrl: verifyUrl,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
        <h1>Welcome to HouseHunt</h1>
        <p>Hi ${user.fullName}, please verify your email.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:600;">Verify Email</a>
        <p style="margin-top:24px;color:#64748b;font-size:14px;">${verifyUrl}</p>
      </div>`,
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${clientUrl()}/reset-password/${token}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your HouseHunt password",
    devLabel: "PASSWORD RESET",
    devUrl: resetUrl,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
        <h1>Password Reset</h1>
        <p>Hi ${user.fullName}, click below to reset your password.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:600;">Reset Password</a>
        <p style="margin-top:24px;color:#64748b;font-size:14px;">${resetUrl}</p>
      </div>`,
  });
};

const sendBookingNotificationEmail = async ({ to, subject, message }) => {
  await sendEmail({
    to,
    subject,
    devLabel: "BOOKING NOTIFICATION",
    devUrl: message,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
        <h1>${subject}</h1>
        <p>${message}</p>
      </div>`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendBookingNotificationEmail,
};
