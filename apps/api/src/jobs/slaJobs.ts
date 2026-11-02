import cron from "node-cron";
import { prisma } from "../lib/prisma";

export function startSlaJobs() {
  // A cada 5 minutos verifica SLAs próximos/vencidos
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();
      const instances = await prisma.ticketSlaInstance.findMany({
        where: {
          completedAt: null,
          breachedAt: null,
          dueAt: { lte: new Date(now.getTime() + 60 * 60 * 1000) } // próximas 60min
        },
        include: { ticket: true }
      });
      for (const inst of instances) {
        const diffMs = inst.dueAt.getTime() - now.getTime();
        const pct = Math.max(0, Math.round((1 - diffMs / (inst.dueAt.getTime() - inst.startedAt.getTime())) * 100));
        if (pct >= 90 && pct < 100) {
          // alerta simplificado - poderia criar notificação
        }
        if (diffMs < 0) {
          await prisma.ticketSlaInstance.update({
            where: { id: inst.id },
            data: { state: "BREACHED", breachedAt: now }
          });
        }
      }
    } catch (e) {
      console.error("SLA_JOB_ERR", e);
    }
  });
  console.log("⏱️  SLA jobs iniciados");
}
