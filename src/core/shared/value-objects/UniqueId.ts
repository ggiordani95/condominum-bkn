import { ValueObject } from "./ValueObject";

export class UniqueId extends ValueObject<string> {
  constructor(id?: string) {
    super(id || UniqueId.generate());
  }

  public static create(id?: string): UniqueId {
    return new UniqueId(id);
  }

  private static generate(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
