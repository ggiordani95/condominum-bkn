import { VisitorRepository, VisitorWithResident } from "../../domain/repositories/VisitorRepository";
import { Visitor, VisitorProps } from "../../domain/entities/Visitor";
import { ResidentVisitor, ResidentVisitorProps } from "../../domain/entities/ResidentVisitor";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { VisitorName } from "../../domain/value-objects/VisitorName";
import { Document } from "../../domain/value-objects/Document";
import { VehiclePlate } from "../../domain/value-objects/VehiclePlate";
import { Result, success, failure } from "../../../../core/shared/Result";
import { prisma } from "../../../../main/database/adapter";
import { UserName } from "../../../user/domain/value-objects/UserName";

export class PrismaVisitorRepository implements VisitorRepository {
  private prisma = prisma;

  async save(visitor: Visitor): Promise<Result<Visitor>> {
    try {
      const visitorData = {
        id: visitor.id.value,
        name: visitor.name.value,
        document: visitor.document.value,
        vehiclePlate: visitor.vehiclePlate?.value || null,
        createdAt: visitor.createdAt,
        updatedAt: visitor.updatedAt,
      };

      const existingVisitor = await this.prisma.visitor.findUnique({
        where: { id: visitor.id.value },
      });

      let savedVisitor;
      if (existingVisitor) {
        savedVisitor = await this.prisma.visitor.update({
          where: { id: visitor.id.value },
          data: {
            name: visitorData.name,
            vehiclePlate: visitorData.vehiclePlate,
            updatedAt: visitorData.updatedAt,
          },
        });
      } else {
        savedVisitor = await this.prisma.visitor.create({
          data: visitorData,
        });
      }

      const domainVisitor = Visitor.restore(
        {
          name: VisitorName.create(savedVisitor.name),
          document: Document.create(savedVisitor.document),
          vehiclePlate: savedVisitor.vehiclePlate ? VehiclePlate.create(savedVisitor.vehiclePlate) : null,
        },
        UniqueId.create(savedVisitor.id),
        savedVisitor.createdAt,
        savedVisitor.updatedAt
      );

      return success(domainVisitor);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findById(id: UniqueId): Promise<Result<Visitor | null>> {
    try {
      const visitorData = await this.prisma.visitor.findUnique({
        where: { id: id.value },
      });

      if (!visitorData) {
        return success(null);
      }

      const domainVisitor = Visitor.restore(
        {
          name: VisitorName.create(visitorData.name),
          document: Document.create(visitorData.document),
          vehiclePlate: visitorData.vehiclePlate ? VehiclePlate.create(visitorData.vehiclePlate) : null,
        },
        UniqueId.create(visitorData.id),
        visitorData.createdAt,
        visitorData.updatedAt
      );

      return success(domainVisitor);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findAll(): Promise<Result<VisitorWithResident[]>> {
    try {
      const now = new Date();
      
      const residentVisitors = await this.prisma.residentVisitor.findMany({
        where: {
          expiresAt: {
            gte: now,
          },
        },
        include: {
          visitor: true,
          resident: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const result: VisitorWithResident[] = residentVisitors.map((rv) => ({
        visitor: Visitor.restore(
          {
            name: VisitorName.create(rv.visitor.name),
            document: Document.create(rv.visitor.document),
            vehiclePlate: rv.visitor.vehiclePlate ? VehiclePlate.create(rv.visitor.vehiclePlate) : null,
          },
          UniqueId.create(rv.visitor.id),
          rv.visitor.createdAt,
          rv.visitor.updatedAt
        ),
        residentVisitor: ResidentVisitor.restore(
          {
            residentId: UniqueId.create(rv.residentId),
            visitorId: UniqueId.create(rv.visitorId),
            expiresAt: rv.expiresAt,
          },
          UniqueId.create(rv.id),
          rv.createdAt,
          rv.expiresAt
        ),
        residentName: rv.resident.name,
      }));

      return success(result);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findByIdWithResident(id: UniqueId): Promise<Result<VisitorWithResident | null>> {
    try {
      const now = new Date();
      
      const residentVisitor = await this.prisma.residentVisitor.findFirst({
        where: {
          visitorId: id.value,
          expiresAt: {
            gte: now,
          },
        },
        include: {
          visitor: true,
          resident: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!residentVisitor) {
        return success(null);
      }

      const result: VisitorWithResident = {
        visitor: Visitor.restore(
          {
            name: VisitorName.create(residentVisitor.visitor.name),
            document: Document.create(residentVisitor.visitor.document),
            vehiclePlate: residentVisitor.visitor.vehiclePlate 
              ? VehiclePlate.create(residentVisitor.visitor.vehiclePlate) 
              : null,
          },
          UniqueId.create(residentVisitor.visitor.id),
          residentVisitor.visitor.createdAt,
          residentVisitor.visitor.updatedAt
        ),
        residentVisitor: ResidentVisitor.restore(
          {
            residentId: UniqueId.create(residentVisitor.residentId),
            visitorId: UniqueId.create(residentVisitor.visitorId),
            expiresAt: residentVisitor.expiresAt,
          },
          UniqueId.create(residentVisitor.id),
          residentVisitor.createdAt,
          residentVisitor.expiresAt
        ),
        residentName: residentVisitor.resident.name,
      };

      return success(result);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async createResidentVisitor(
    residentId: UniqueId,
    visitorId: UniqueId
  ): Promise<Result<ResidentVisitor>> {
    try {
      const residentVisitor = ResidentVisitor.create(residentId, visitorId);

      const savedResidentVisitor = await this.prisma.residentVisitor.create({
        data: {
          id: residentVisitor.id.value,
          residentId: residentVisitor.residentId.value,
          visitorId: residentVisitor.visitorId.value,
          createdAt: residentVisitor.createdAt,
          expiresAt: residentVisitor.expiresAt,
        },
      });

      const domainResidentVisitor = ResidentVisitor.restore(
        {
          residentId: UniqueId.create(savedResidentVisitor.residentId),
          visitorId: UniqueId.create(savedResidentVisitor.visitorId),
          expiresAt: savedResidentVisitor.expiresAt,
        },
        UniqueId.create(savedResidentVisitor.id),
        savedResidentVisitor.createdAt,
        savedResidentVisitor.expiresAt
      );

      return success(domainResidentVisitor);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findActiveResidentVisitors(visitorId: UniqueId): Promise<Result<ResidentVisitor[]>> {
    try {
      const now = new Date();
      
      const residentVisitors = await this.prisma.residentVisitor.findMany({
        where: {
          visitorId: visitorId.value,
          expiresAt: {
            gte: now,
          },
        },
      });

      const domainResidentVisitors = residentVisitors.map((rv) =>
        ResidentVisitor.restore(
          {
            residentId: UniqueId.create(rv.residentId),
            visitorId: UniqueId.create(rv.visitorId),
            expiresAt: rv.expiresAt,
          },
          UniqueId.create(rv.id),
          rv.createdAt,
          rv.expiresAt
        )
      );

      return success(domainResidentVisitors);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async deleteExpiredVisitors(): Promise<Result<void>> {
    try {
      const now = new Date();
      
      await this.prisma.residentVisitor.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      });

      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}

