import { ValueObject } from "../../../../core/shared/value-objects/ValueObject";

export class UserName extends ValueObject<string> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;

  constructor(name: string) {
    if (!name) {
      throw new Error("Name is required");
    }

    const trimmedName = name.trim();

    if (trimmedName.length < UserName.MIN_LENGTH) {
      throw new Error(
        `Name must be at least ${UserName.MIN_LENGTH} characters long`
      );
    }

    if (trimmedName.length > UserName.MAX_LENGTH) {
      throw new Error(
        `Name must be at most ${UserName.MAX_LENGTH} characters long`
      );
    }

    super(trimmedName);
  }

  public static create(name: string): UserName {
    return new UserName(name);
  }

  public getFirstName(): string {
    return this._value.split(" ")[0];
  }

  public getLastName(): string {
    const parts = this._value.split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : "";
  }
}
