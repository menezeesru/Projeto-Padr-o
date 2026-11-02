import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { prisma } from "../lib/prisma";

export async function listUsers(req: AuthRequest, res: Response) {
  const users = await prisma.user.findMany({
    where: { active: true },
    include: { userRoles: { include: { role: true } }, department: true },
    orderBy: { name: "asc" }
  });
  res.json(users);
}
