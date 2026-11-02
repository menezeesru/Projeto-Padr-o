import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { prisma } from "../lib/prisma";

export async function listAudit(req: AuthRequest, res: Response) {
  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 200
  });
  res.json(logs);
}
