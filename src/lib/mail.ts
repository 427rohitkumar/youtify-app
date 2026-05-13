import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"Youtify Support" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: '🔐 Your Youtify Password Reset OTP',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #007ACC; text-align: center;">Youtify Security</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Use the following 6-digit OTP to verify your identity:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h1 style="letter-spacing: 10px; margin: 0; color: #333;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 Youtify. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
