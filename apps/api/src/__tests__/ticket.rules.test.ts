import { describe, it, expect } from "vitest";
import { PRIORITY_ORDER, SLA_DEFAULTS } from "@servicedesk/shared";

describe("Regras de negócio - Chamados", () => {
  it("Deve ter ordem correta de prioridade", () => {
    expect(PRIORITY_ORDER.P1_CRITICA).toBe(1);
    expect(PRIORITY_ORDER.P4_BAIXA).toBe(4);
  });

  it("Deve ter SLA padrão para P1 crítica", () => {
    expect(SLA_DEFAULTS.P1_CRITICA.firstResponseMinutes).toBe(15);
    expect(SLA_DEFAULTS.P1_CRITICA.resolutionMinutes).toBe(240);
  });

  it("P3/P4 devem ter SLA em horas úteis (marcado)", () => {
    expect(SLA_DEFAULTS.P3_MEDIA.businessHoursOnly).toBe(true);
    expect(SLA_DEFAULTS.P4_BAIXA.businessHoursOnly).toBe(true);
  });
});
