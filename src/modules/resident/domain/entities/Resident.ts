
import { Entity } from "../../../../core/shared/Entity";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";

export interface ResidentProps {
  userId: UniqueId;
  unitId: UniqueId;
  role: "owner" | "tenant" | "family";
  isActive: boolean;
}

export class Resident extends Entity<ResidentProps> {
  private constructor(
    props: ResidentProps,
    id?: UniqueId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(props, id, createdAt, updatedAt);
  }

  public static create(
    userId: UniqueId,
    unitId: UniqueId,
    role: "owner" | "tenant" | "family" = "owner",
    id?: UniqueId
  ): Resident {
    const props: ResidentProps = {
      userId,
      unitId,
      role,
      isActive: true,
    };

    return new Resident(props, id);
  }

  public static restore(
    props: ResidentProps,
    id: UniqueId,
    createdAt: Date,
    updatedAt: Date
  ): Resident {
    return new Resident(props, id, createdAt, updatedAt);
  }

  public get userId(): UniqueId {
    return this._props.userId;
  }

  public get unitId(): UniqueId {
    return this._props.unitId;
  }

  public get role(): "owner" | "tenant" | "family" {
    return this._props.role;
  }

  public get isActive(): boolean {
    return this._props.isActive;
  }

  public changeUnit(unitId: UniqueId): void {
    this._props.unitId = unitId;
    this.touch();
  }

  public changeRole(role: "owner" | "tenant" | "family"): void {
    this._props.role = role;
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

  public toJSON() {
    return {
      id: this._id.value,
      userId: this._props.userId.value,
      unitId: this._props.unitId.value,
      role: this._props.role,
      isActive: this._props.isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

