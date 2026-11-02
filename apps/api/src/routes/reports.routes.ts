import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { exportReportsExcel } from "../controllers/reports.controller";

const router = Router();
router.use(authenticate);

router.get("/export/excel", exportReportsExcel);

export default router;
