import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { createTicket, listTickets, getTicket, addComment, changeStatus, assignTicket } from "../controllers/ticket.controller";

const router = Router();
router.use(authenticate);

router.post("/", authorize(["SOLICITANTE", "ADMIN", "GESTOR_TI", "SUPERVISOR"]), createTicket);
router.get("/", listTickets);
router.get("/:id", getTicket);
router.post("/:id/comments", addComment);
router.patch("/:id/status", changeStatus);
router.post("/:id/assign", authorize(["ADMIN", "GESTOR_TI", "SUPERVISOR"]), assignTicket);

export default router;
