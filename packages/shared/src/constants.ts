import { Priority } from "./enums";

export const PRIORITY_ORDER: Record<Priority, number> = {
  P1_CRITICA: 1,
  P2_ALTA: 2,
  P3_MEDIA: 3,
  P4_BAIXA: 4
};

export const SLA_DEFAULTS: Record<Priority, { firstResponseMinutes: number; resolutionMinutes: number; businessHoursOnly?: boolean }> = {
  P1_CRITICA: { firstResponseMinutes: 15, resolutionMinutes: 240 },
  P2_ALTA: { firstResponseMinutes: 30, resolutionMinutes: 480 },
  P3_MEDIA: { firstResponseMinutes: 120, resolutionMinutes: 1440, businessHoursOnly: true },
  P4_BAIXA: { firstResponseMinutes: 240, resolutionMinutes: 2880, businessHoursOnly: true }
};

export const TICKET_NUMBER_PREFIX = "SD";
export const APP_NAME = "ServiceDesk Pro";
export const PALETTE = {
  primary: "#1565C0",
  primaryDark: "#0D2B52",
  primaryLight: "#EAF3FF",
  bg: "#F5F7FA",
  border: "#DCE3EB",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#DC2626",
  white: "#FFFFFF"
};
