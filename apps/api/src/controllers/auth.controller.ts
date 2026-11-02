import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "@servicedesk/shared";
import { AuthRequest } from "../middlewares/auth";

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { userRoles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
    });
    if (!user || !user.active) return res.status(401).json({ error: "Credenciais inválidas" });
    if (user.blockedUntil && user.blockedUntil > new Date()) {
      return res.status(423).json({ error: "Conta temporariamente bloqueada por tentativas excessivas" });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      const attempts = user.loginAttempts + 1;
      const update: any = { loginAttempts: attempts };
      if (attempts >= Number(process.env.LOGIN_MAX_ATTEMPTS || 5)) {
        update.blockedUntil = new Date(Date.now() + Number(process.env.LOGIN_BLOCK_MINUTES || 15) * 60000);
      }
      await prisma.user.update({ where: { id: user.id }, data: update });
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: 0, blockedUntil: null, lastLoginAt: new Date() } });
    const roleCodes = user.userRoles.map((ur) => ur.role.code);
    const permissions = user.userRoles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.code));
    const payload = { id: user.id, email: user.email, roleCodes, permissions };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", { expiresIn: process.env.JWT_EXPIRES_IN || "15m" } as any);
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "dev-refresh", { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" } as any);
    return res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, roleCodes, permissions }
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

export async function me(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    include: { userRoles: { include: { role: true } }, department: true, location: true }
  });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    roleCodes: user.userRoles.map((ur) => ur.role.code),
    department: user.department,
    location: user.location,
    lastLoginAt: user.lastLoginAt
  });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "refreshToken obrigatório" });
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "dev-refresh") as any;
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { userRoles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
    });
    if (!user || !user.active) return res.status(401).json({ error: "Inválido" });
    const roleCodes = user.userRoles.map((ur) => ur.role.code);
    const permissions = user.userRoles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.code));
    const newPayload = { id: user.id, email: user.email, roleCodes, permissions };
    const accessToken = jwt.sign(newPayload, process.env.JWT_SECRET || "dev-secret", { expiresIn: process.env.JWT_EXPIRES_IN || "15m" } as any);
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: "Refresh token inválido" });
  }
}
