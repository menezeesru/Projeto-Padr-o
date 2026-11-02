import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { prisma } from "../lib/prisma";
import { generateTicketNumber } from "../utils/ticketNumber";
import { createTicketSchema, ticketCommentSchema, changeStatusSchema, assignTicketSchema } from "@servicedesk/shared";
import { createSlaInstancesForTicket } from "../services/slaService";
import { logAudit } from "../utils/audit";

function canSeeAll(req: AuthRequest) {
  const roles = req.user?.roleCodes || [];
  return roles.includes("ADMIN") || roles.includes("GESTOR_TI") || roles.includes("SUPERVISOR");
}

export async function createTicket(req: AuthRequest, res: Response) {
  try {
    const parsed = createTicketSchema.safeParse(req.body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const fieldErrors = flat.fieldErrors as any;
      if (fieldErrors?.categoryId?.[0]) return res.status(400).json({ error: fieldErrors.categoryId[0] });
      if (fieldErrors?.serviceId?.[0]) return res.status(400).json({ error: fieldErrors.serviceId[0] });
      if (fieldErrors?.departmentId?.[0]) return res.status(400).json({ error: fieldErrors.departmentId[0] });
      if (fieldErrors?.locationId?.[0]) return res.status(400).json({ error: fieldErrors.locationId[0] });
      if (fieldErrors?.assetId?.[0]) return res.status(400).json({ error: fieldErrors.assetId[0] });
      if (fieldErrors?.title?.[0]) return res.status(400).json({ error: fieldErrors.title[0] });
      if (fieldErrors?.description?.[0]) return res.status(400).json({ error: fieldErrors.description[0] });
      return res.status(400).json({ error: "Dados inválidos", details: flat });
    }
    const data = parsed.data;
    if (data.categoryId) {
      const cat = await prisma.ticketCategory.findUnique({ where: { id: data.categoryId } });
      if (!cat || !cat.active) {
        return res.status(400).json({ error: "Categoria inválida ou não encontrada" });
      }
    }
    if (data.serviceId) {
      const svc = await prisma.serviceCatalog.findUnique({ where: { id: data.serviceId } });
      if (!svc || !svc.active) {
        return res.status(400).json({ error: "Serviço inválido ou não encontrado" });
      }
    }
    if (data.departmentId) {
      const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
      if (!dept) {
        return res.status(400).json({ error: "Departamento inválido ou não encontrado" });
      }
    }
    if (data.locationId) {
      const loc = await prisma.location.findUnique({ where: { id: data.locationId } });
      if (!loc) {
        return res.status(400).json({ error: "Localização inválida ou não encontrada" });
      }
    }
    if (data.assetId) {
      const asset = await prisma.asset.findUnique({ where: { id: data.assetId } });
      if (!asset) {
        return res.status(400).json({ error: "Ativo inválido ou não encontrado" });
      }
    }
    const number = await generateTicketNumber();
    const impact = data.impact || "MEDIO";
    const urgency = data.urgency || "MEDIA";
    // simple priority calc
    let priority = data.priority || "P3_MEDIA";
    if (impact === "ALTO" && urgency === "ALTA") priority = "P1_CRITICA";
    else if ((impact === "ALTO" && urgency === "MEDIA") || (impact === "MEDIO" && urgency === "ALTA")) priority = "P2_ALTA";
    else if ((impact === "BAIXO" && urgency === "ALTA") || (impact === "MEDIO" && urgency === "BAIXA")) priority = "P3_MEDIA";
    else if (impact === "BAIXO" && urgency === "BAIXA") priority = "P4_BAIXA";

    const createData: any = {
      number,
      title: data.title,
      description: data.description,
      status: "NOVO",
      priority,
      impact,
      urgency,
      requesterId: req.user!.id,
      tags: data.tags || [],
      openedAt: new Date()
    };
    if (data.categoryId) createData.categoryId = data.categoryId;
    if (data.serviceId) createData.serviceId = data.serviceId;
    if (data.departmentId) createData.departmentId = data.departmentId;
    if (data.locationId) createData.locationId = data.locationId;
    if (data.assetId) createData.assetId = data.assetId;
    // Atribui à fila geral se existir
    try {
      const defaultQueue = await prisma.queue.findFirst({ where: { active: true } });
      if (defaultQueue && !createData.queueId) {
        createData.queueId = defaultQueue.id;
      }
    } catch {}
    const ticket = await prisma.ticket.create({
      data: createData
    });

    await prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        actorId: req.user!.id,
        action: "TICKET_CREATED",
        toValue: JSON.stringify({ number, title: ticket.title, priority })
      }
    });

    await createSlaInstancesForTicket(ticket.id);
    await logAudit(req, "TICKET_CREATE", "Ticket", ticket.id, null, ticket);
    res.status(201).json(ticket);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function listTickets(req: AuthRequest, res: Response) {
  try {
    const { status, priority, assigneeId, teamId, q, mine } = req.query as any;
    const where: any = {};
    if (mine === "true") {
      where.OR = [{ requesterId: req.user!.id }, { assigneeId: req.user!.id }];
    } else if (!canSeeAll(req)) {
      where.OR = [{ requesterId: req.user!.id }, { assigneeId: req.user!.id }];
    }
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;
    if (teamId) where.teamId = teamId;
    if (q) {
      const qFilter = [
        { number: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } }
      ];
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: qFilter }];
        delete where.OR;
      } else {
        where.OR = qFilter;
      }
    }
    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        requester: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        team: true,
        category: true
      },
      orderBy: { openedAt: "desc" },
      take: 100
    });
    res.json(tickets);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function getTicket(req: AuthRequest, res: Response) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: {
        requester: true,
        assignee: true,
        team: true,
        queue: true,
        category: true,
        service: true,
        department: true,
        location: true,
        asset: true,
        comments: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: "asc" } },
        attachments: true,
        history: { include: { actor: { select: { id: true, name: true } } }, orderBy: { createdAt: "asc" } },
        slaInstances: { include: { policy: true }, orderBy: { createdAt: "asc" } },
        assignments: { orderBy: { createdAt: "asc" } }
      }
    });
    if (!ticket) return res.status(404).json({ error: "Chamado não encontrado" });
    const roles = req.user?.roleCodes || [];
    const isOwner = ticket.requesterId === req.user!.id || ticket.assigneeId === req.user!.id;
    const canAll = roles.includes("ADMIN") || roles.includes("GESTOR_TI") || roles.includes("SUPERVISOR");
    if (!canAll && !isOwner) return res.status(403).json({ error: "Sem permissão para visualizar este chamado" });
    // hide internal comments if not tech/admin
    if (!canAll && roles.includes("SOLICITANTE")) {
      (ticket as any).comments = ticket.comments.filter((c: any) => !c.isInternal);
    }
    res.json(ticket);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function addComment(req: AuthRequest, res: Response) {
  try {
    const parsed = ticketCommentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inv�lidos", details: parsed.error.flatten() });
    const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
    if (!ticket) return res.status(404).json({ error: "Chamado não encontrado" });
    const roles = req.user?.roleCodes || [];
    const isInternal = parsed.data.isInternal && (roles.includes("TECNICO") || roles.includes("SUPERVISOR") || roles.includes("GESTOR_TI") || roles.includes("ADMIN"));
    const comment = await prisma.ticketComment.create({
      data: {
        ticketId: ticket.id,
        authorId: req.user!.id,
        content: parsed.data.content,
        isInternal
      }
    });
    await prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        actorId: req.user!.id,
        action: "COMMENT_ADDED",
        meta: { isInternal }
      }
    });
    await logAudit(req, "TICKET_COMMENT", "Ticket", ticket.id, null, { commentId: comment.id, isInternal });
    res.status(201).json(comment);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function changeStatus(req: AuthRequest, res: Response) {
  try {
    const parsed = changeStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inv�lidos", details: parsed.error.flatten() });
    const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
    if (!ticket) return res.status(404).json({ error: "Chamado não encontrado" });
    const before = { status: ticket.status };
    const update: any = { status: parsed.data.status, updatedAt: new Date() };
    if (parsed.data.status === "EM_ATENDIMENTO" && !ticket.inProgressAt) update.inProgressAt = new Date();
    if (parsed.data.status === "RESOLVIDO") update.resolvedAt = new Date();
    if (parsed.data.status === "ENCERRADO") update.closedAt = new Date();
    const updated = await prisma.ticket.update({ where: { id: ticket.id }, data: update });
    await prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        actorId: req.user!.id,
        action: "STATUS_CHANGED",
        field: "status",
        fromValue: ticket.status,
        toValue: parsed.data.status,
        reason: parsed.data.reason
      }
    });
    await logAudit(req, "TICKET_STATUS_CHANGE", "Ticket", ticket.id, before, { status: parsed.data.status });
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function assignTicket(req: AuthRequest, res: Response) {
  try {
    const parsed = assignTicketSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inv�lidos", details: parsed.error.flatten() });
    const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
    if (!ticket) return res.status(404).json({ error: "Chamado não encontrado" });
    const before = { assigneeId: ticket.assigneeId, teamId: ticket.teamId, queueId: ticket.queueId };
    const updated = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        assigneeId: parsed.data.assigneeId || null,
        teamId: parsed.data.teamId || ticket.teamId,
        queueId: parsed.data.queueId || ticket.queueId,
        status: parsed.data.assigneeId ? "ATRIBUIDO" : ticket.status,
        updatedAt: new Date()
      }
    });
    await prisma.ticketAssignment.create({
      data: {
        ticketId: ticket.id,
        fromUserId: ticket.assigneeId,
        toUserId: parsed.data.assigneeId,
        fromTeamId: ticket.teamId,
        toTeamId: parsed.data.teamId,
        fromQueueId: ticket.queueId,
        toQueueId: parsed.data.queueId,
        type: "MANUAL",
        reason: parsed.data.reason,
        actorId: req.user!.id
      }
    });
    await prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        actorId: req.user!.id,
        action: "TICKET_ASSIGNED",
        meta: parsed.data
      }
    });
    await logAudit(req, "TICKET_ASSIGN", "Ticket", ticket.id, before, { assigneeId: parsed.data.assigneeId });
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
