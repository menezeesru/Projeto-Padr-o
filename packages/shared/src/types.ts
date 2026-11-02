import { ApprovalStatus, AssetStatus, AssetType, Impact, NotificationType, Priority, RoleCode, SlaState, SlaType, TicketStatus, Urgency } from "./enums";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  roleCode: RoleCode;
  departmentId?: string | null;
  locationId?: string | null;
  active: boolean;
  lastLoginAt?: Date | string | null;
}

export interface TicketDto {
  id: string;
  number: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  impact: Impact;
  urgency: Urgency;
  requesterId: string;
  assigneeId?: string | null;
  teamId?: string | null;
  queueId?: string | null;
  categoryId?: string | null;
  serviceId?: string | null;
  departmentId?: string | null;
  locationId?: string | null;
  assetId?: string | null;
  openedAt: Date | string;
  firstResponseAt?: Date | string | null;
  inProgressAt?: Date | string | null;
  resolvedAt?: Date | string | null;
  closedAt?: Date | string | null;
  dueFirstResponseAt?: Date | string | null;
  dueResolutionAt?: Date | string | null;
  tags: string[];
}

export interface SlaInstanceDto {
  id: string;
  ticketId: string;
  type: SlaType;
  state: SlaState;
  startedAt: Date | string;
  dueAt: Date | string;
  pausedAt?: Date | string | null;
  resumedAt?: Date | string | null;
  completedAt?: Date | string | null;
  breachedAt?: Date | string | null;
  pausedMinutes: number;
}

export interface NotificationDto {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  ticketId?: string | null;
  createdAt: Date | string;
}

export interface AssetDto {
  id: string;
  code: string;
  serialNumber?: string | null;
  type: AssetType;
  status: AssetStatus;
  manufacturer?: string | null;
  model?: string | null;
  ownerUserId?: string | null;
  locationId?: string | null;
  purchaseDate?: Date | string | null;
  warrantyEndsAt?: Date | string | null;
}

export interface ApprovalDto {
  id: string;
  ticketId?: string | null;
  status: ApprovalStatus;
  requesterId: string;
  currentStep: number;
  totalSteps: number;
  dueAt?: Date | string | null;
}
