import { Entity } from "../../../../core/shared/Entity";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { Email } from "../../../../core/shared/value-objects/Email";
import { UserName } from "../value-objects/UserName";
import { HashedPassword } from "../value-objects/HashedPassword";

export interface UserProps {
  name: UserName;
  email: Email;
  password: HashedPassword;
  isActive: boolean;
}

export class User extends Entity<UserProps> {
  private constructor(
    props: UserProps,
    id?: UniqueId,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null
  ) {
    super(props, id, createdAt, updatedAt, deletedAt);
  }

  public static create(
    name: UserName,
    email: Email,
    password: HashedPassword,
    id?: UniqueId
  ): User {
    const props: UserProps = {
      name,
      email,
      password,
      isActive: true,
    };

    return new User(props, id);
  }

  public static restore(
    props: UserProps,
    id: UniqueId,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date | null
  ): User {
    return new User(props, id, createdAt, updatedAt, deletedAt);
  }

  
  public get name(): UserName {
    return this._props.name;
  }

  public get email(): Email {
    return this._props.email;
  }

  public get password(): HashedPassword {
    return this._props.password;
  }

  public get isActive(): boolean {
    return this._props.isActive;
  }

  // Business Methods
  public async verifyPassword(plainPassword: string): Promise<boolean> {
    return await this._props.password.compare(plainPassword);
  }

  public updateName(name: UserName): void {
    this._props.name = name;
    this.touch();
  }

  public updateEmail(email: Email): void {
    this._props.email = email;
    this.touch();
  }

  public async updatePassword(newPassword: string): Promise<void> {
    this._props.password = await HashedPassword.fromPlainText(newPassword);
    this.touch();
  }

  public activate(): void {
    this._props.isActive = true;
    this.touch();
  }

  public deactivate(): void {
    this._props.isActive = false;
    this.touch();
  }

  // Validation
  public isValidForLogin(): boolean {
    return this._props.isActive;
  }

  public toJSON() {
    return {
      id: this._id.value,
      name: this._props.name.value,
      email: this._props.email.value,
      isActive: this._props.isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
