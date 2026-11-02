import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { listAudit } from "../controllers/audit.controller";

const router = Router();
router.use(authenticate);
router.get("/", authorize(["ADMIN", "AUDIT_VIEW"]), listAudit);

export default router;
