import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth";

export async function logAudit(req: AuthRequest, action: string, entity: string, entityId?: string, before?: any, after?: any, meta?: any) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action,
        entity,
        entityId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        before: before || null,
        after: after || null,
        meta: meta || null
      }
    });
  } catch (e) {
    console.error("AUDIT_LOG_FAIL", e);
  }
}
