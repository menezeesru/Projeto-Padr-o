import { z } from "zod";
import { Impact, Priority, RoleCode, TicketStatus, Urgency } from "./enums";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres")
});

export const createTicketSchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres").max(150),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  categoryId: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.string().uuid("Categoria inválida").optional()),
  serviceId: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.string().uuid("Serviço inválido").optional()),
  departmentId: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.string().uuid("Departamento inválido").optional()),
  locationId: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.string().uuid("Localização inválida").optional()),
  assetId: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.string().uuid("Ativo inválido").optional()),
  impact: z.nativeEnum(Impact).default(Impact.MEDIO),
  urgency: z.nativeEnum(Urgency).default(Urgency.MEDIA),
  priority: z.nativeEnum(Priority).optional(),
  tags: z.array(z.string()).optional()
});

export const ticketCommentSchema = z.object({
  content: z.string().min(1, "Comentário não pode estar vazio"),
  isInternal: z.boolean().default(false)
});

export const assignTicketSchema = z.object({
  assigneeId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  queueId: z.string().uuid().optional(),
  reason: z.string().min(3).optional()
});

export const changeStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus),
  reason: z.string().min(3, "Justificativa obrigatória").optional()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type TicketCommentInput = z.infer<typeof ticketCommentSchema>;
export type AssignTicketInput = z.infer<typeof assignTicketSchema>;
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
export { RoleCode, TicketStatus, Priority, Impact, Urgency };
