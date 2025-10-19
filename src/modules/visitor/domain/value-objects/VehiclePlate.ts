import { ValueObject } from "../../../../core/shared/value-objects/ValueObject";

export class VehiclePlate extends ValueObject<string> {
  constructor(plate: string) {
    if (!plate || plate.trim().length === 0) {
      throw new Error("Placa do veículo não pode estar vazia");
    }

    const cleanPlate = plate.trim().toUpperCase();

    const plateRegex = /^[A-Z]{3}-?\d{1}[A-Z0-9]{1}\d{2}$/;
    if (!plateRegex.test(cleanPlate)) {
      throw new Error("Formato de placa inválido");
    }

    super(cleanPlate);
  }

  public static create(plate: string): VehiclePlate {
    return new VehiclePlate(plate);
  }

  public static createOptional(plate?: string | null): VehiclePlate | null {
    if (!plate) {
      return null;
    }
    return VehiclePlate.create(plate);
  }

  public format(): string {
    const plate = this._value;
    if (plate.length === 7) {
      return `${plate.substring(0, 3)}-${plate.substring(3)}`;
    }
    return plate;
  }
}
