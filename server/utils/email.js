const nodemailer = require("nodemailer");

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

const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email/${token}`;

  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
      <h1 style="color: #0f172a;">Welcome to HouseHunt</h1>
      <p>Hi ${user.fullName},</p>
      <p>Please verify your email to start using HouseHunt.</p>
      <a href="${verifyUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:600;">
        Verify Email
      </a>
      <p style="margin-top:24px;color:#64748b;font-size:14px;">Or copy this link: ${verifyUrl}</p>
    </div>
  `;

  const transporter = createTransporter();

  if (transporter) {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "HouseHunt <noreply@househunt.app>",
      to: user.email,
      subject: "Verify your HouseHunt account",
      html,
    });
    return;
  }

  console.log("\n--- EMAIL VERIFICATION (dev mode) ---");
  console.log(`To: ${user.email}`);
  console.log(`Verify URL: ${verifyUrl}`);
  console.log("-------------------------------------\n");
};

module.exports = { sendVerificationEmail };
