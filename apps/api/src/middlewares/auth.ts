import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; roleCodes: string[]; permissions: string[] };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não informado" });
  }
  const token = header.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as any;
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export function authorize(roles: string[] = [], permissions: string[] = []) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Não autenticado" });
    const hasRole = roles.length === 0 || roles.some((r) => req.user?.roleCodes.includes(r));
    const hasPerm = permissions.length === 0 || permissions.some((p) => req.user?.permissions.includes(p));
    if (!hasRole && !hasPerm) return res.status(403).json({ error: "Sem permissão para esta ação" });
    return next();
  };
}
