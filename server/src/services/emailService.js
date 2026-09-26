import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
  if (!process.env.BACKEND_URL) {
    throw new Error('BACKEND_URL is required.');
  }

  const backendUrl = new URL(process.env.BACKEND_URL);
  if (
    backendUrl.protocol !== 'https:' ||
    ['localhost', '127.0.0.1', '::1', 'your-render-service.onrender.com'].includes(backendUrl.hostname)
  ) {
    throw new Error('BACKEND_URL must be a public HTTPS URL.');
  }

  const { BREVO_SMTP_USER, BREVO_SMTP_PASS, BREVO_SENDER_EMAIL } = process.env;
  if (!BREVO_SMTP_USER || !BREVO_SMTP_PASS || !BREVO_SENDER_EMAIL) {
    throw new Error('Brevo SMTP credentials and sender address are required.');
  }

  const verificationUrl = new URL('/api/auth/verify-email', backendUrl);
  verificationUrl.searchParams.set('token', token);

  const smtpPort = Number(process.env.BREVO_SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: BREVO_SMTP_USER,
      pass: BREVO_SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: {
      name: process.env.BREVO_SENDER_NAME || 'CelestiCare',
      address: BREVO_SENDER_EMAIL
    },
    to: email,
    subject: 'Verify your CelestiCare email address',
    text: `Verify your email address by opening this link: ${verificationUrl}`,
    html: `<p>Confirm your email address to finish creating your CelestiCare account.</p><p><a href="${verificationUrl}">Verify email address</a></p><p>This link expires in 24 hours.</p>`
  });
};