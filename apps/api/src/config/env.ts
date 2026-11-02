import * as dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_PORT: Number(process.env.API_PORT) || 4000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "dev-refresh",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  CORS_ORIGIN: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
  TIMEZONE: process.env.TIMEZONE || "America/Sao_Paulo",
  AUTO_CLOSE_RESOLVED_HOURS: Number(process.env.AUTO_CLOSE_RESOLVED_HOURS || 72),
  ENABLE_SLA_ALERTS: process.env.ENABLE_SLA_ALERTS === "true"
};
