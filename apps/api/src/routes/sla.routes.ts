import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { listSlaInstances } from "../controllers/sla.controller";

const router = Router();
router.use(authenticate);
router.get("/instances", listSlaInstances);

export default router;
