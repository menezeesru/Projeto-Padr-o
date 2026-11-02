import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { listUsers } from "../controllers/user.controller";

const router = Router();
router.use(authenticate);
router.get("/", authorize(["ADMIN", "GESTOR_TI", "SUPERVISOR"]), listUsers);

export default router;
