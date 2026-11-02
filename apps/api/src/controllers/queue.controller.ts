import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { prisma } from "../lib/prisma";
import { logAudit } from "../utils/audit";

export async function listQueues(req: AuthRequest, res: Response) {
  const queues = await prisma.queue.findMany({
    where: { active: true },
    include: { team: true, members: true, _count: { select: { tickets: true } } }
  });
  res.json(queues);
}

export async function listQueueTickets(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const tickets = await prisma.ticket.findMany({
    where: {
      AND: [
        { OR: [
          { queueId: id },
          { queueId: null }
        ] },
        { status: { in: ["NA_FILA", "NOVO", "AGUARDANDO_TRIAGEM", "ATRIBUIDO", "EM_ATENDIMENTO", "RESOLVIDO"] } }
      ]
    },
    include: { requester: true, category: true, priorityModel: true, assignee: { select: { id: true, name: true, email: true } } },
    orderBy: [{ openedAt: "asc" }]
  });
  res.json(tickets);
}

export async function acceptTicket(req: AuthRequest, res: Response) {
  try {
    const { ticketId } = req.params;
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return res.status(404).json({ error: "Chamado não encontrado" });
    if (ticket.assigneeId) return res.status(409).json({ error: "Chamado já atribuído a outro técnico" });
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assigneeId: req.user!.id,
        status: "EM_ATENDIMENTO",
        inProgressAt: ticket.inProgressAt || new Date(),
        updatedAt: new Date()
      }
    });
    await prisma.ticketAssignment.create({
      data: {
        ticketId,
        fromUserId: ticket.assigneeId || null,
        toUserId: req.user!.id,
        type: "MANUAL",
        reason: "Aceite pelo técnico",
        actorId: req.user!.id
      }
    });
    await prisma.ticketHistory.create({
      data: {
        ticketId,
        actorId: req.user!.id,
        action: "TICKET_ACCEPTED",
        fromValue: ticket.status,
        toValue: "EM_ATENDIMENTO"
      }
    });
    await logAudit(req, "TICKET_ACCEPT", "Ticket", ticketId, { status: ticket.status }, { status: "EM_ATENDIMENTO", assigneeId: req.user!.id });
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function finalizeTicket(req: AuthRequest, res: Response) {
  try {
    const { ticketId } = req.params;
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return res.status(404).json({ error: "Chamado não encontrado" });
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: "RESOLVIDO",
        resolvedAt: ticket.resolvedAt || new Date(),
        updatedAt: new Date()
      }
    });
    await prisma.ticketHistory.create({
      data: {
        ticketId,
        actorId: req.user!.id,
        action: "TICKET_RESOLVED",
        fromValue: ticket.status,
        toValue: "RESOLVIDO"
      }
    });
    await logAudit(req, "TICKET_RESOLVE", "Ticket", ticketId, { status: ticket.status }, { status: "RESOLVIDO" });
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
