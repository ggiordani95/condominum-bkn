import { describe, it, expect } from "vitest";
import { VisitorName } from "../VisitorName";

describe("VisitorName", () => {
  it("deve criar um nome válido", () => {
    const name = VisitorName.create("João da Silva");

    expect(name.value).toBe("João da Silva");
  });

  it("deve remover espaços extras", () => {
    const name = VisitorName.create("  João da Silva  ");

    expect(name.value).toBe("João da Silva");
  });

  it("deve falhar quando o nome está vazio", () => {
    expect(() => VisitorName.create("")).toThrow(
      "Nome do visitante não pode estar vazio"
    );
  });

  it("deve falhar quando o nome tem menos de 3 caracteres", () => {
    expect(() => VisitorName.create("Jo")).toThrow(
      "Nome do visitante deve ter no mínimo 3 caracteres"
    );
  });

  it("deve falhar quando o nome tem mais de 100 caracteres", () => {
    const longName = "a".repeat(101);
    
    expect(() => VisitorName.create(longName)).toThrow(
      "Nome do visitante deve ter no máximo 100 caracteres"
    );
  });

  it("deve aceitar nome com exatamente 3 caracteres", () => {
    const name = VisitorName.create("Ana");

    expect(name.value).toBe("Ana");
  });

  it("deve aceitar nome com exatamente 100 caracteres", () => {
    const exactName = "a".repeat(100);
    const name = VisitorName.create(exactName);

    expect(name.value).toBe(exactName);
  });
});

