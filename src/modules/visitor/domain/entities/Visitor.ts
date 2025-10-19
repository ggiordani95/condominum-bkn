import { Entity } from "../../../../core/shared/Entity";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { VisitorName } from "../value-objects/VisitorName";
import { Document } from "../value-objects/Document";
import { VehiclePlate } from "../value-objects/VehiclePlate";

export interface VisitorProps {
  name: VisitorName;
  document: Document;
  vehiclePlate: VehiclePlate | null;
}

export class Visitor extends Entity<VisitorProps> {
  private constructor(
    props: VisitorProps,
    id?: UniqueId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(props, id, createdAt, updatedAt);
  }

  public static create(
    name: VisitorName,
    document: Document,
    vehiclePlate: VehiclePlate | null,
    id?: UniqueId
  ): Visitor {
    const props: VisitorProps = {
      name,
      document,
      vehiclePlate,
    };

    return new Visitor(props, id);
  }

  public static restore(
    props: VisitorProps,
    id: UniqueId,
    createdAt: Date,
    updatedAt: Date
  ): Visitor {
    return new Visitor(props, id, createdAt, updatedAt);
  }

  public get name(): VisitorName {
    return this._props.name;
  }

  public get document(): Document {
    return this._props.document;
  }

  public get vehiclePlate(): VehiclePlate | null {
    return this._props.vehiclePlate;
  }

  public updateName(name: VisitorName): void {
    this._props.name = name;
    this.touch();
  }

  public updateVehiclePlate(vehiclePlate: VehiclePlate | null): void {
    this._props.vehiclePlate = vehiclePlate;
    this.touch();
  }

  public toJSON() {
    return {
      id: this._id.value,
      name: this._props.name.value,
      document: this._props.document.value,
      vehiclePlate: this._props.vehiclePlate?.value || null,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

