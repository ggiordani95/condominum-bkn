import { Visitor } from "../entities/Visitor";
import { ResidentVisitor } from "../entities/ResidentVisitor";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { Result } from "../../../../core/shared/Result";

export interface VisitorWithResident {
  visitor: Visitor;
  residentVisitor: ResidentVisitor;
  residentName: string;
}

export interface VisitorRepository {
  save(visitor: Visitor): Promise<Result<Visitor>>;
  findById(id: UniqueId): Promise<Result<Visitor | null>>;
  findAll(): Promise<Result<VisitorWithResident[]>>;
  findByIdWithResident(id: UniqueId): Promise<Result<VisitorWithResident | null>>;
  createResidentVisitor(
    residentId: UniqueId,
    visitorId: UniqueId
  ): Promise<Result<ResidentVisitor>>;
  findActiveResidentVisitors(visitorId: UniqueId): Promise<Result<ResidentVisitor[]>>;
  deleteExpiredVisitors(): Promise<Result<void>>;
}

