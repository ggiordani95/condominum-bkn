import { describe, it, expect } from "vitest";
import { VehiclePlate } from "../VehiclePlate";

describe("VehiclePlate", () => {
  it("deve criar uma placa válida no formato antigo", () => {
    const plate = VehiclePlate.create("ABC-1234");

    expect(plate.value).toBe("ABC-1234");
  });

  it("deve criar uma placa válida no formato Mercosul", () => {
    const plate = VehiclePlate.create("ABC1D23");

    expect(plate.value).toBe("ABC1D23");
  });

  it("deve converter para maiúsculas", () => {
    const plate = VehiclePlate.create("abc-1234");

    expect(plate.value).toBe("ABC-1234");
  });

  it("deve aceitar placa sem hífen", () => {
    const plate = VehiclePlate.create("ABC1234");

    expect(plate.value).toBe("ABC1234");
  });

  it("deve formatar placa com hífen", () => {
    const plate = VehiclePlate.create("ABC1234");

    expect(plate.format()).toBe("ABC-1234");
  });

  it("deve falhar quando a placa está vazia", () => {
    expect(() => VehiclePlate.create("")).toThrow(
      "Placa do veículo não pode estar vazia"
    );
  });

  it("deve falhar quando o formato é inválido", () => {
    expect(() => VehiclePlate.create("12345678")).toThrow(
      "Formato de placa inválido"
    );
  });

  it("deve retornar null quando createOptional recebe null", () => {
    const plate = VehiclePlate.createOptional(null);

    expect(plate).toBeNull();
  });

  it("deve retornar null quando createOptional recebe undefined", () => {
    const plate = VehiclePlate.createOptional(undefined);

    expect(plate).toBeNull();
  });

  it("deve criar placa quando createOptional recebe valor válido", () => {
    const plate = VehiclePlate.createOptional("ABC-1234");

    expect(plate).not.toBeNull();
    expect(plate?.value).toBe("ABC-1234");
  });
});

