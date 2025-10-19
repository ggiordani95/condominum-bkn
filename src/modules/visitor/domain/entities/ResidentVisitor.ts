import { Entity } from "../../../../core/shared/Entity";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";

export interface ResidentVisitorProps {
  residentId: UniqueId;
  visitorId: UniqueId;
  expiresAt: Date;
}

export class ResidentVisitor extends Entity<ResidentVisitorProps> {
  private constructor(
    props: ResidentVisitorProps,
    id?: UniqueId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(props, id, createdAt, updatedAt);
  }

  public static create(
    residentId: UniqueId,
    visitorId: UniqueId,
    id?: UniqueId
  ): ResidentVisitor {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const props: ResidentVisitorProps = {
      residentId,
      visitorId,
      expiresAt,
    };

    return new ResidentVisitor(props, id);
  }

  public static restore(
    props: ResidentVisitorProps,
    id: UniqueId,
    createdAt: Date,
    updatedAt: Date
  ): ResidentVisitor {
    return new ResidentVisitor(props, id, createdAt, updatedAt);
  }

  public get residentId(): UniqueId {
    return this._props.residentId;
  }

  public get visitorId(): UniqueId {
    return this._props.visitorId;
  }

  public get expiresAt(): Date {
    return this._props.expiresAt;
  }

  public isExpired(): boolean {
    return new Date() > this._props.expiresAt;
  }

  public getRemainingTime(): number {
    const now = new Date();
    const remaining = this._props.expiresAt.getTime() - now.getTime();
    return Math.max(0, remaining);
  }

  public toJSON() {
    return {
      id: this._id.value,
      residentId: this._props.residentId.value,
      visitorId: this._props.visitorId.value,
      createdAt: this._createdAt,
      expiresAt: this._props.expiresAt,
    };
  }
}

