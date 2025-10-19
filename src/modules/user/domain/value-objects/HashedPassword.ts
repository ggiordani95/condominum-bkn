import { ValueObject } from "../../../../core/shared/value-objects/ValueObject";

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

    // TODO: Implementar hash da senha com bcrypt
    // const hash = await bcrypt.hash(password, 12);
    const hash = `hashed_${password}`; // Placeholder

    return new HashedPassword(hash);
  }

  public async compare(plainPassword: string): Promise<boolean> {
    if (!plainPassword) {
      return false;
    }

    // TODO: Implementar comparação com bcrypt
    // return await bcrypt.compare(plainPassword, this._value);
    return this._value === `hashed_${plainPassword}`; // Placeholder
  }
}
