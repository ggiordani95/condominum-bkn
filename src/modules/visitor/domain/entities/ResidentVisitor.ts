import { Entity } from "../../../../core/shared/Entity";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { TimeLimit } from "../value-objects/TimeLimit";

export interface ResidentVisitorProps {
  residentId: UniqueId;
  visitorId: UniqueId;
  timeLimit: TimeLimit;
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
    timeLimit: TimeLimit,
    daysValid: number = 1,
    id?: UniqueId
  ): ResidentVisitor {
    if (daysValid < 1) {
      throw new Error("Days valid must be at least 1");
    }

    if (daysValid > 30) {
      throw new Error("Days valid cannot exceed 30 days");
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysValid);
    expiresAt.setHours(23, 59, 59, 999);

    const props: ResidentVisitorProps = {
      residentId,
      visitorId,
      timeLimit,
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

  public get timeLimit(): TimeLimit {
    return this._props.timeLimit;
  }

  public get expiresAt(): Date {
    return this._props.expiresAt;
  }

  public isExpired(): boolean {
    return new Date() > this._props.expiresAt;
  }

  public canEnterNow(): boolean {
    if (this.isExpired()) {
      return false;
    }

    return !this._props.timeLimit.isBeforeNow();
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
      timeLimit: this._props.timeLimit.value,
      createdAt: this._createdAt,
      expiresAt: this._props.expiresAt,
    };
  }
}

