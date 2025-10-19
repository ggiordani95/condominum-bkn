import { ValueObject } from "./ValueObject";

export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!Email.EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error("Invalid email format");
    }

    super(trimmedEmail);
  }

  public static create(email: string): Email {
    return new Email(email);
  }

  public getDomain(): string {
    return this._value.split("@")[1];
  }

  public getLocalPart(): string {
    return this._value.split("@")[0];
  }
}
