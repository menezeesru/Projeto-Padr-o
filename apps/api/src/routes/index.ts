import { Router } from "express";
import authRoutes from "./auth.routes";
import ticketRoutes from "./ticket.routes";
import queueRoutes from "./queue.routes";
import dashboardRoutes from "./dashboard.routes";
import slaRoutes from "./sla.routes";
import userRoutes from "./user.routes";
import auditRoutes from "./audit.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/queues", queueRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/sla", slaRoutes);
router.use("/users", userRoutes);
router.use("/audit", auditRoutes);

export default router;
