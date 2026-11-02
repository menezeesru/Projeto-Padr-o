import { describe, it, expect } from "vitest";
import { RoleCode } from "@servicedesk/shared";

describe("Perfis de acesso", () => {
  it("Deve conter todos os perfis exigidos", () => {
    expect(RoleCode.ADMIN).toBe("ADMIN");
    expect(RoleCode.GESTOR_TI).toBe("GESTOR_TI");
    expect(RoleCode.SUPERVISOR).toBe("SUPERVISOR");
    expect(RoleCode.TECNICO).toBe("TECNICO");
    expect(RoleCode.SOLICITANTE).toBe("SOLICITANTE");
  });
});
