import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const e = process.env;

export const isProduction = e.NODE_ENV === "production";

if (isProduction && !e.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set in production (see server/.env.example).",
  );
}

if (isProduction && !e.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET must be set in production (see server/.env.example).",
  );
}

export const env = {
  port: Number(e.PORT ?? 4000),
  appUrl: (e.APP_URL ?? "http://localhost:4000").replace(/\/$/, ""),
  appName: e.APP_NAME ?? "CodesExperts",
  timezone: e.APP_TIMEZONE ?? "Asia/Kolkata",

  mongo: {
    uri: e.MONGODB_URI || "mongodb://127.0.0.1:27017",
    database: e.MONGODB_DB || "codesexperts-react-db",
  },

  jwtSecret: e.JWT_SECRET ?? "dev-only-secret-change-me",

  uploadsDir: path.resolve(root, e.UPLOADS_DIR ?? "uploads"),
  clientDist: path.resolve(root, e.CLIENT_DIST ?? "../client/dist"),

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
