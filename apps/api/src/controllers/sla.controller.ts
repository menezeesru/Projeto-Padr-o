import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { prisma } from "../lib/prisma";

export async function listSlaInstances(req: AuthRequest, res: Response) {
  const instances = await prisma.ticketSlaInstance.findMany({
    include: { ticket: true, policy: true },
    orderBy: { dueAt: "asc" },
    take: 100
  });
  res.json(instances);
}
