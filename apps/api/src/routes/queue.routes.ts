import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { listQueues, listQueueTickets, acceptTicket, finalizeTicket } from "../controllers/queue.controller";

const router = Router();
router.use(authenticate);

router.get("/", listQueues);
router.get("/:id/tickets", listQueueTickets);
router.post("/tickets/:ticketId/accept", authorize(["TECNICO", "SUPERVISOR", "GESTOR_TI", "ADMIN"]), acceptTicket);
router.post("/tickets/:ticketId/finalize", authorize(["TECNICO", "SUPERVISOR", "GESTOR_TI", "ADMIN"]), finalizeTicket);

export default router;
