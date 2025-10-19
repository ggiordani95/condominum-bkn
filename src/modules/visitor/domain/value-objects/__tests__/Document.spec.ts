import { describe, it, expect } from "vitest";
import { Document } from "../Document";

describe("Document", () => {
  it("deve criar um documento válido", () => {
    const document = Document.create("12345678900");

    expect(document.value).toBe("12345678900");
  });

  it("deve remover caracteres não numéricos", () => {
    const document = Document.create("123.456.789-00");

    expect(document.value).toBe("12345678900");
  });

  it("deve formatar o CPF corretamente", () => {
    const document = Document.create("12345678900");

    expect(document.format()).toBe("123.456.789-00");
  });

  it("deve falhar quando o documento está vazio", () => {
    expect(() => Document.create("")).toThrow("Documento não pode estar vazio");
  });

  it("deve falhar quando o documento tem menos de 11 dígitos", () => {
    expect(() => Document.create("123456789")).toThrow(
      "Documento deve ter no mínimo 11 dígitos"
    );
  });

  it("deve aceitar documento com mais de 11 dígitos", () => {
    const document = Document.create("12345678900123");

    expect(document.value).toBe("12345678900123");
  });
});

