import { prisma } from "../lib/prisma";
import { addMinutes } from "date-fns";

export async function createSlaInstancesForTicket(ticketId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { category: true, service: true }
  });
  if (!ticket) return;
  let policyId: string | undefined;
  if (ticket.service?.slaPolicyId) policyId = ticket.service.slaPolicyId;
  else if (ticket.category?.slaPolicyId) policyId = ticket.category.slaPolicyId;
  const policy = policyId ? await prisma.slaPolicy.findUnique({ where: { id: policyId }, include: { calendar: true } }) : await prisma.slaPolicy.findFirst({ where: { active: true }, include: { calendar: true } });
  if (!policy) return;
  const now = new Date();
  // First response
  await prisma.ticketSlaInstance.create({
    data: {
      ticketId,
      policyId: policy.id,
      type: "FIRST_RESPONSE",
      state: "ON_TRACK",
      startedAt: now,
      dueAt: addMinutes(now, policy.firstResponseMinutes)
    }
  });
  // Resolution
  await prisma.ticketSlaInstance.create({
    data: {
      ticketId,
      policyId: policy.id,
      type: "RESOLUTION",
      state: "ON_TRACK",
      startedAt: now,
      dueAt: addMinutes(now, policy.resolutionMinutes)
    }
  });
}
