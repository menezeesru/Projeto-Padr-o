import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ServiceDesk Pro...");

  // Permissions
  const permissions = [
    { code: "TICKETS_VIEW_ALL", name: "Ver todos os chamados", module: "tickets" },
    { code: "TICKETS_CREATE", name: "Abrir chamados", module: "tickets" },
    { code: "TICKETS_ASSIGN", name: "Atribuir chamados", module: "tickets" },
    { code: "TICKETS_UPDATE", name: "Atualizar chamados", module: "tickets" },
    { code: "TICKETS_CLOSE", name: "Encerrar chamados", module: "tickets" },
    { code: "QUEUES_MANAGE", name: "Gerenciar filas", module: "queues" },
    { code: "SLA_MANAGE", name: "Gerenciar SLA", module: "sla" },
    { code: "USERS_MANAGE", name: "Gerenciar usuários", module: "users" },
    { code: "TEAMS_MANAGE", name: "Gerenciar equipes", module: "teams" },
    { code: "REPORTS_VIEW", name: "Ver relatórios", module: "reports" },
    { code: "AUDIT_VIEW", name: "Ver auditoria", module: "audit" },
    { code: "SETTINGS_MANAGE", name: "Gerenciar configurações", module: "settings" },
    { code: "KB_MANAGE", name: "Gerenciar base de conhecimento", module: "kb" },
    { code: "ASSETS_MANAGE", name: "Gerenciar ativos", module: "assets" },
    { code: "APPROVALS_MANAGE", name: "Gerenciar aprovações", module: "approvals" }
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: p
    });
  }

  // Roles
  const roleDefs = [
    { code: "ADMIN", name: "Administrador", desc: "Acesso total" },
    { code: "GESTOR_TI", name: "Gestor de TI", desc: "Indicadores, SLA, equipes" },
    { code: "SUPERVISOR", name: "Supervisor", desc: "Distribuição, escalonamento" },
    { code: "TECNICO", name: "Técnico de TI", desc: "Atendimento" },
    { code: "SOLICITANTE", name: "Solicitante", desc: "Abertura e acompanhamento" }
  ];

  for (const r of roleDefs) {
    await prisma.role.upsert({
      where: { code: r.code },
      update: {},
      create: { code: r.code, name: r.name, description: r.desc }
    });
  }

  // Give all perms to ADMIN
  const adminRole = await prisma.role.findUnique({ where: { code: "ADMIN" } });
  const allPerms = await prisma.permission.findMany();
  if (adminRole) {
    for (const perm of allPerms) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: perm.id }
      });
    }
  }

  // Statuses
  const statuses = [
    { code: "NOVO", name: "Novo", isOpen: true, sortOrder: 1 },
    { code: "AGUARDANDO_TRIAGEM", name: "Aguardando triagem", isOpen: true, sortOrder: 2 },
    { code: "NA_FILA", name: "Na fila", isOpen: true, sortOrder: 3 },
    { code: "ATRIBUIDO", name: "Atribuído", isOpen: true, sortOrder: 4 },
    { code: "EM_ATENDIMENTO", name: "Em atendimento", isOpen: true, sortOrder: 5 },
    { code: "AGUARDANDO_SOLICITANTE", name: "Aguardando solicitante", isOpen: true, sortOrder: 6 },
    { code: "AGUARDANDO_TERCEIRO", name: "Aguardando terceiro", isOpen: true, sortOrder: 7 },
    { code: "AGUARDANDO_APROVACAO", name: "Aguardando aprovação", isOpen: true, sortOrder: 8 },
    { code: "RESOLVIDO", name: "Resolvido", isOpen: true, sortOrder: 9 },
    { code: "ENCERRADO", name: "Encerrado", isOpen: false, sortOrder: 10, isFinal: true },
    { code: "REABERTO", name: "Reaberto", isOpen: true, sortOrder: 11 },
    { code: "CANCELADO", name: "Cancelado", isOpen: false, sortOrder: 12, isFinal: true }
  ];
  for (const s of statuses) {
    await prisma.ticketStatusModel.upsert({ where: { code: s.code }, update: {}, create: s });
  }

  // Priorities
  const priorities = [
    { code: "P1_CRITICA", name: "P1 - Crítica", level: 1, color: "#DC2626" },
    { code: "P2_ALTA", name: "P2 - Alta", level: 2, color: "#F59E0B" },
    { code: "P3_MEDIA", name: "P3 - Média", level: 3, color: "#1565C0" },
    { code: "P4_BAIXA", name: "P4 - Baixa", level: 4, color: "#22C55E" }
  ];
  for (const p of priorities) {
    await prisma.ticketPriority.upsert({ where: { code: p.code }, update: {}, create: p });
  }

  // Calendar + SLA
  const calendar = await prisma.slaCalendar.upsert({
    where: { name: "Comercial" },
    update: {},
    create: {
      name: "Comercial",
      timezone: process.env.TIMEZONE || "America/Sao_Paulo",
      workStart: "08:00",
      workEnd: "18:00",
      workDays: [1, 2, 3, 4, 5]
    }
  });

  await prisma.slaPolicy.upsert({
    where: { name: "Padrão TI" },
    update: {},
    create: {
      name: "Padrão TI",
      description: "Política padrão conforme matriz inicial",
      firstResponseMinutes: 120,
      resolutionMinutes: 1440,
      businessHoursOnly: true,
      calendarId: calendar.id,
      escalateAfterPercent: 90
    }
  });

  // Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@servicedesk.local";
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "Admin@123456";
  const hash = await bcrypt.hash(adminPass, 12);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: process.env.SEED_ADMIN_NAME || "Administrador",
      email: adminEmail,
      passwordHash: hash,
      active: true
    }
  });
  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id }
    });
  }

  console.log("✅ Seed concluído.");
  console.log(`   Admin: ${adminEmail} / ${adminPass}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
