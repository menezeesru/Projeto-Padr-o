import { Router } from "express";
import { login, me, refresh } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/refresh", refresh);

export default router;
