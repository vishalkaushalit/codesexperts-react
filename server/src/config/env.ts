const e = process.env;

/** True on Vercel (preview + production) and when NODE_ENV=production. */
export const isProduction = e.NODE_ENV === "production" || e.VERCEL === "1";

for (const key of ["MONGODB_URI", "JWT_SECRET"]) {
  if (isProduction && !e[key]) {
    throw new Error(`${key} must be set in production (see server/.env.example).`);
  }
}

export const env = {
  // Optional: falls back to the Vercel production domain, then to the local dev site.
  appUrl: (
    e.APP_URL ??
    (e.VERCEL_PROJECT_PRODUCTION_URL ? `https://${e.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:5173")
  ).replace(/\/$/, ""),
  appName: "CodesExperts",
  timezone: "Asia/Kolkata",

  mongo: {
    uri: e.MONGODB_URI || "mongodb://127.0.0.1:27017",
    database: e.MONGODB_DB || "codesexperts-react-db",
  },

  jwtSecret: e.JWT_SECRET ?? "dev-only-secret-change-me",

  // Images are stored in Vercel Blob; the SDK reads BLOB_READ_WRITE_TOKEN itself.
  blobToken: e.BLOB_READ_WRITE_TOKEN ?? "",

  // Optional SMTP for enquiry emails. Not set = emails are printed to the server log.
  mail: {
    host: e.SMTP_HOST ?? "",
    port: Number(e.SMTP_PORT ?? 465),
    secure: (e.SMTP_SECURE ?? "true") === "true",
    user: e.SMTP_USER ?? "",
    pass: e.SMTP_PASSWORD ?? "",
    from: e.MAIL_FROM ?? "support@codesexperts.com",
    adminEmail: e.ADMIN_EMAIL ?? "support@codesexperts.com",
  },
};
