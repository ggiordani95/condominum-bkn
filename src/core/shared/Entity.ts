import { UniqueId } from "./value-objects/UniqueId";

export abstract class Entity<T> {
  protected readonly _id: UniqueId;
  protected _props: T;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;

  constructor(props: T, id?: UniqueId, createdAt?: Date, updatedAt?: Date) {
    this._id = id || new UniqueId();
    this._props = props;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  public get id(): UniqueId {
    return this._id;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  public equals(other: Entity<T>): boolean {
    if (!other) return false;
    return this._id.equals(other._id);
  }
}
