import nodemailer from 'nodemailer';

let transporter;

// Built lazily on first send, not at import time: ESM hoists this module's
// import (via app.js) ahead of server.js's dotenv.config() call, so
// process.env.GOOGLE_* would still be undefined if the transporter were
// created at module load.
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      family: 4, // force IPv4 - avoids ETIMEDOUT on networks with broken IPv6 routing
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
      tls: {
        // local AV/proxy TLS interception breaks cert validation in dev; keep verification strict in production
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
  }
  return transporter;
}

export async function sendEmail({to, subject, html, text}) {
  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text,
  };
  const info = await getTransporter().sendMail(mailOptions);
  console.log('Email sent: '+info);
}