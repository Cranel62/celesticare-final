# CelestiCare Final (MERN Stack)
Assistive Healthcare, Equipment, and Requisitions Management Platform.

## Cloud deployment

Configure secrets in the hosting provider's environment settings; do not commit them.

Render server variables: `NODE_ENV=production`, `PORT` (provided by Render), `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, `ALLOWED_ORIGINS` (comma-separated exact Vercel origins), `BACKEND_URL` (the public HTTPS Render service URL), `BREVO_SMTP_HOST=smtp-relay.brevo.com`, `BREVO_SMTP_PORT=587`, `BREVO_SMTP_USER`, `BREVO_SMTP_PASS`, and `BREVO_SENDER_EMAIL`. `BREVO_SENDER_NAME` is optional. `ADMIN_SECRET_KEY` and `DEFAULT_PASSWORD` are optional and have no built-in values.

Set Vercel's `VITE_API_BASE_URL` to the public Render URL followed by `/api`, for example `https://your-service.onrender.com/api`. Rebuild the frontend after changing it. Signup sends a one-time verification link that expires after 24 hours; users cannot log in until they open it. Existing accounts are grandfathered as verified.