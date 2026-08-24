import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM_EMAIL"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Ada variabel yang tertinggal: ${envVar}`);
  }
}

const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
if (isNaN(smtpPort)) {
  throw new Error(`SMTP_PORT invalid: ${process.env.SMTP_PORT}`);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const kirimEmailResetPassword = async (
  email: string,
  namaLengkap: string | null,
  resetLink: string,
) => {
  try {
    const info = await transporter.sendMail({
      from: `"Nusa Residence" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: "Reset Password - Nusa Residence",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Nusa Residence</h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b;">Halo ${namaLengkap || "Pengguna"}!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Kami menerima permintaan untuk mereset password akun Nusa Residence Anda.
            </p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Klik tombol di bawah ini untuk mereset password Anda:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
              <strong>Link ini akan kadaluarsa dalam 1 jam.</strong>
            </p>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              Jika Anda tidak meminta reset password, abaikan email ini. Password Anda akan tetap aman.
            </p>
            <p style="color: #94a3b8; font-size: 14px;">
              Salam,<br>
              <strong>Tim Nusa Residence</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email reset password terkirim:", info.messageId);
    return { sukses: true, info };
  } catch (error) {
    console.error("Gagal kirim email:", error);
    return { sukses: false, error };
  }
};
