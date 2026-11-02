import { prisma } from "../lib/prisma";
import { TICKET_NUMBER_PREFIX } from "@servicedesk/shared";

export async function generateTicketNumber(): Promise<string> {
  const count = await prisma.ticket.count();
  const seq = String(count + 1).padStart(6, "0");
  const year = new Date().getFullYear();
  return `${TICKET_NUMBER_PREFIX}-${year}-${seq}`;
}
