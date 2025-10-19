import { VisitorRepository, VisitorWithResident } from "../../domain/repositories/VisitorRepository";
import { Visitor } from "../../domain/entities/Visitor";
import { ResidentVisitor } from "../../domain/entities/ResidentVisitor";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { Result, success, failure } from "../../../../core/shared/Result";

export class InMemoryVisitorRepository implements VisitorRepository {
  private visitors: Visitor[] = [];
  private residentVisitors: ResidentVisitor[] = [];
  private residentNames: Map<string, string> = new Map();

  async save(visitor: Visitor): Promise<Result<Visitor>> {
    const index = this.visitors.findIndex((v) => v.id.equals(visitor.id));
    
    if (index >= 0) {
      this.visitors[index] = visitor;
    } else {
      this.visitors.push(visitor);
    }

    return success(visitor);
  }

  async findById(id: UniqueId): Promise<Result<Visitor | null>> {
    const visitor = this.visitors.find((v) => v.id.equals(id));
    return success(visitor || null);
  }

  async findAll(): Promise<Result<VisitorWithResident[]>> {
    const now = new Date();
    
    const activeResidentVisitors = this.residentVisitors
      .filter((rv) => rv.expiresAt > now)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); 

    const result: VisitorWithResident[] = activeResidentVisitors.map((rv) => {
      const visitor = this.visitors.find((v) => v.id.equals(rv.visitorId))!;
      const residentName = this.residentNames.get(rv.residentId.value) || "Unknown";

      return {
        visitor,
        residentVisitor: rv,
        residentName,
      };
    });

    return success(result);
  }

  async findByIdWithResident(id: UniqueId): Promise<Result<VisitorWithResident | null>> {
    const now = new Date();
    
    const residentVisitor = this.residentVisitors.find(
      (rv) => rv.visitorId.equals(id) && rv.expiresAt > now
    );

    if (!residentVisitor) {
      return success(null);
    }

    const visitor = this.visitors.find((v) => v.id.equals(id))!;
    const residentName = this.residentNames.get(residentVisitor.residentId.value) || "Unknown";

    return success({
      visitor,
      residentVisitor,
      residentName,
    });
  }

  async createResidentVisitor(
    residentId: UniqueId,
    visitorId: UniqueId
  ): Promise<Result<ResidentVisitor>> {
    const residentVisitor = ResidentVisitor.create(residentId, visitorId);
    this.residentVisitors.push(residentVisitor);
    return success(residentVisitor);
  }

  async findActiveResidentVisitors(visitorId: UniqueId): Promise<Result<ResidentVisitor[]>> {
    const now = new Date();
    
    const active = this.residentVisitors.filter(
      (rv) => rv.visitorId.equals(visitorId) && rv.expiresAt > now
    );

    return success(active);
  }

  async deleteExpiredVisitors(): Promise<Result<void>> {
    const now = new Date();
    this.residentVisitors = this.residentVisitors.filter(
      (rv) => rv.expiresAt > now
    );
    return success(undefined);
  }

  setResidentName(residentId: string, name: string): void {
    this.residentNames.set(residentId, name);
  }

  clear(): void {
    this.visitors = [];
    this.residentVisitors = [];
    this.residentNames.clear();
  }
}

