import { ValueObject } from "../../../../core/shared/value-objects/ValueObject";

export class VisitorName extends ValueObject<string> {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 100;

  constructor(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error("Nome do visitante não pode estar vazio");
    }

    const trimmedName = name.trim();

    if (trimmedName.length < VisitorName.MIN_LENGTH) {
      throw new Error(
        `Nome do visitante deve ter no mínimo ${VisitorName.MIN_LENGTH} caracteres`
      );
    }

    if (trimmedName.length > VisitorName.MAX_LENGTH) {
      throw new Error(
        `Nome do visitante deve ter no máximo ${VisitorName.MAX_LENGTH} caracteres`
      );
    }

    super(trimmedName);
  }

  public static create(name: string): VisitorName {
    return new VisitorName(name);
  }
}
