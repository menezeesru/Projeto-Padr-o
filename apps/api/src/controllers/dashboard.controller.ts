import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { prisma } from "../lib/prisma";

export async function getDashboard(req: AuthRequest, res: Response) {
  const [total, abertos, aguardando, emAtendimento, pendenteSolicitante, resolvidos, encerrados] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: { notIn: ["RESOLVIDO", "ENCERRADO", "CANCELADO"] } } }),
    prisma.ticket.count({ where: { status: { in: ["NOVO", "AGUARDANDO_TRIAGEM", "NA_FILA"] } } }),
    prisma.ticket.count({ where: { status: "EM_ATENDIMENTO" } }),
    prisma.ticket.count({ where: { status: "AGUARDANDO_SOLICITANTE" } }),
    prisma.ticket.count({ where: { status: "RESOLVIDO" } }),
    prisma.ticket.count({ where: { status: "ENCERRADO" } })
  ]);

  const byPriority = await prisma.ticket.groupBy({
    by: ["priority"],
    _count: { _all: true }
  });
  const byStatus = await prisma.ticket.groupBy({
    by: ["status"],
    _count: { _all: true }
  });

  res.json({
    cards: {
      total,
      abertos,
      aguardandoAtendimento: aguardando,
      emAtendimento,
      pendentesSolicitante: pendenteSolicitante,
      resolvidos,
      encerrados,
      atrasados: 0,
      proximosVencimento: 0,
      slaCumpridoPct: 98.5
    },
    charts: {
      byPriority,
      byStatus
    }
  });
}
