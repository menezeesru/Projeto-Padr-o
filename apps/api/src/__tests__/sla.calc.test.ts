import { describe, it, expect } from "vitest";
import { addMinutes } from "date-fns";

describe("Cálculo de SLA", () => {
  it("Deve calcular vencimento corretamente", () => {
    const start = new Date("2026-01-01T08:00:00Z");
    const due = addMinutes(start, 15);
    expect(due.getTime() - start.getTime()).toBe(15 * 60000);
  });
});
