import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import queueRoutes from "./routes/queue.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import slaRoutes from "./routes/sla.routes";
import userRoutes from "./routes/user.routes";
import auditRoutes from "./routes/audit.routes";
import reportsRoutes from "./routes/reports.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { startSlaJobs } from "./jobs/slaJobs";

dotenv.config();

const app = express();
const PORT = Number(process.env.API_PORT) || 4000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return originalJson(body);
  };
  next();
});

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MIN || 15) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api", limiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "servicedesk-api", timestamp: new Date().toISOString() });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/sla", slaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/reports", reportsRoutes);

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 ServiceDesk API running on http://0.0.0.0:${PORT}`);
  console.log(`📚 Swagger docs at http://0.0.0.0:${PORT}/api/docs`);
  startSlaJobs();
});
