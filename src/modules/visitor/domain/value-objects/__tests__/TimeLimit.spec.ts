import { describe, it, expect } from "vitest";
import { TimeLimit } from "../TimeLimit";

describe("TimeLimit", () => {
  it("deve criar um horário válido no formato HH:MM", () => {
    const timeLimit = TimeLimit.create("16:00");
    expect(timeLimit.value).toBe("16:00");
  });

  it("deve criar horário com minutos diferentes de zero", () => {
    const timeLimit = TimeLimit.create("14:30");
    expect(timeLimit.value).toBe("14:30");
  });

  it("deve aceitar horário de início do dia (00:00)", () => {
    const timeLimit = TimeLimit.create("00:00");
    expect(timeLimit.value).toBe("00:00");
  });

  it("deve aceitar horário de fim do dia (23:59)", () => {
    const timeLimit = TimeLimit.create("23:59");
    expect(timeLimit.value).toBe("23:59");
  });

  it("deve falhar quando o horário está vazio", () => {
    expect(() => TimeLimit.create("")).toThrow("Time limit is required");
  });

  it("deve falhar quando o formato é inválido (sem dois pontos)", () => {
    expect(() => TimeLimit.create("1600")).toThrow("Time limit must be in HH:MM format");
  });

  it("deve falhar quando a hora excede 23", () => {
    expect(() => TimeLimit.create("24:00")).toThrow("Time limit must be in HH:MM format");
  });

  it("deve falhar quando os minutos excedem 59", () => {
    expect(() => TimeLimit.create("14:60")).toThrow("Time limit must be in HH:MM format");
  });

  it("deve falhar quando hora tem apenas um dígito", () => {
    expect(() => TimeLimit.create("9:30")).toThrow("Time limit must be in HH:MM format");
  });

  it("deve falhar quando minuto tem apenas um dígito", () => {
    expect(() => TimeLimit.create("09:5")).toThrow("Time limit must be in HH:MM format");
  });

  it("deve retornar as horas corretamente", () => {
    const timeLimit = TimeLimit.create("16:30");
    expect(timeLimit.getHours()).toBe(16);
  });

  it("deve retornar os minutos corretamente", () => {
    const timeLimit = TimeLimit.create("16:30");
    expect(timeLimit.getMinutes()).toBe(30);
  });

  it("deve aplicar o horário em uma data", () => {
    const timeLimit = TimeLimit.create("16:00");
    const date = new Date(2024, 0, 15, 10, 30, 45); 
    const newDate = timeLimit.applyToDate(date);

    expect(newDate.getHours()).toBe(16);
    expect(newDate.getMinutes()).toBe(0);
    expect(newDate.getSeconds()).toBe(0);
    expect(newDate.getMilliseconds()).toBe(0);
    expect(newDate.getDate()).toBe(15);
    expect(newDate.getMonth()).toBe(0);
  });

  it("isBeforeNow deve retornar true quando o horário limite já passou", () => {
    const now = new Date();
    const pastHour = now.getHours() - 1;
    const pastHourStr = String(pastHour).padStart(2, "0");
    const timeLimit = TimeLimit.create(`${pastHourStr}:00`);
    
    expect(timeLimit.isBeforeNow()).toBe(true);
  });

  it("isBeforeNow deve retornar false quando o horário limite ainda não passou", () => {
    const timeLimit = TimeLimit.create("23:59");
    expect(timeLimit.isBeforeNow()).toBe(false);
  });
});

