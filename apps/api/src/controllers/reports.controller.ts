import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { prisma } from "../lib/prisma";
import * as XLSX from "xlsx";

export async function exportReportsExcel(req: AuthRequest, res: Response) {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        requester: { select: { name: true, email: true } },
        assignee: { select: { name: true, email: true } },
        category: true,
        department: true
      },
      orderBy: { openedAt: "desc" }
    });

    const data = tickets.map((t) => ({
      Protocolo: t.number,
      Titulo: t.title,
      Solicitante: t.requester?.name || "",
      Email_Solicitante: t.requester?.email || "",
      Status: t.status,
      Prioridade: t.priority,
      Impacto: t.impact,
      Urgencia: t.urgency,
      Responsavel: t.assignee?.name || "",
      Categoria: t.category?.name || "",
      Departamento: t.department?.name || "",
      Data_Abertura: t.openedAt ? new Date(t.openedAt).toLocaleString("pt-BR") : "",
      Data_Resolucao: t.resolvedAt ? new Date(t.resolvedAt).toLocaleString("pt-BR") : "",
      Data_Encerramento: t.closedAt ? new Date(t.closedAt).toLocaleString("pt-BR") : ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Chamados");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=relatorio-chamados-${new Date().toISOString().split("T")[0]}.xlsx`);
    res.send(buffer);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
