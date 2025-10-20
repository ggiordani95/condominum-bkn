import { ValueObject } from "../../../../core/shared/value-objects/ValueObject";
import bcrypt from "bcrypt";

export class HashedPassword extends ValueObject<string> {
  constructor(hashedPassword: string) {
    if (!hashedPassword) {
      throw new Error("Hashed password is required");
    }

    if (hashedPassword.trim().length === 0) {
      throw new Error("Hashed password cannot be empty");
    }

    super(hashedPassword);
  }

  public static create(hashedPassword: string): HashedPassword {
    return new HashedPassword(hashedPassword);
  }

  public static async fromPlainText(password: string): Promise<HashedPassword> {
    if (!password) {
      throw new Error("Password is required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const hash = await bcrypt.hash(password, 12);

    return new HashedPassword(hash);
  }

  public async compare(plainPassword: string): Promise<boolean> {
    if (!plainPassword) {
      return false;
    }

    return await bcrypt.compare(plainPassword, this._value);
  }
}
