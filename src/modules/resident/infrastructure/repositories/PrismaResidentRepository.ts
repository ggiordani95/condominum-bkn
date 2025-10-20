import { Result, success, failure } from "../../../../core/shared/Result";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { DatabaseError } from "../../../../core/shared/errors/DomainErrors";
import { Resident } from "../../domain/entities/Resident";
import { ResidentRepository } from "../../domain/repositories/ResidentRepository";
import { prisma } from "../../../../main/database/adapter";

export class PrismaResidentRepository implements ResidentRepository {
  private prisma = prisma;

  async save(resident: Resident): Promise<Result<Resident>> {
    try {
      const data = await this.prisma.resident.create({
        data: {
          id: resident.id.value,
          userId: resident.userId.value,
          unitId: resident.unitId.value,
          role: resident.role,
          isActive: resident.isActive,
          createdAt: resident.createdAt,
          updatedAt: resident.updatedAt,
        },
      });

      const restoredResident = Resident.restore(
        {
          userId: UniqueId.create(data.userId),
          unitId: UniqueId.create(data.unitId),
          role: data.role as "owner" | "tenant" | "family",
          isActive: data.isActive,
        },
        UniqueId.create(data.id),
        data.createdAt,
        data.updatedAt
      );

      return success(restoredResident);
    } catch (error) {
      return failure(
        new DatabaseError(
          error instanceof Error ? error.message : "Erro ao salvar morador"
        )
      );
    }
  }

  async findById(id: UniqueId): Promise<Result<Resident | null>> {
    try {
      const data = await this.prisma.resident.findUnique({
        where: { id: id.value },
      });

      if (!data) {
        return success(null);
      }

      const resident = Resident.restore(
        {
          userId: UniqueId.create(data.userId),
          unitId: UniqueId.create(data.unitId),
          role: data.role as "owner" | "tenant" | "family",
          isActive: data.isActive,
        },
        UniqueId.create(data.id),
        data.createdAt,
        data.updatedAt
      );

      return success(resident);
    } catch (error) {
      return failure(
        new DatabaseError(
          error instanceof Error ? error.message : "Erro ao buscar morador"
        )
      );
    }
  }

  async findByUserId(userId: UniqueId): Promise<Result<Resident | null>> {
    try {
      const data = await this.prisma.resident.findFirst({
        where: { userId: userId.value },
      });

      if (!data) {
        return success(null);
      }

      const resident = Resident.restore(
        {
          userId: UniqueId.create(data.userId),
          unitId: UniqueId.create(data.unitId),
          role: data.role as "owner" | "tenant" | "family",
          isActive: data.isActive,
        },
        UniqueId.create(data.id),
        data.createdAt,
        data.updatedAt
      );

      return success(resident);
    } catch (error) {
      return failure(
        new DatabaseError(
          error instanceof Error ? error.message : "Erro ao buscar morador por userId"
        )
      );
    }
  }

  async findByUnitId(unitId: UniqueId): Promise<Result<Resident[]>> {
    try {
      const data = await this.prisma.resident.findMany({
        where: { unitId: unitId.value },
      });

      const residents = data.map(item =>
        Resident.restore(
          {
            userId: UniqueId.create(item.userId),
            unitId: UniqueId.create(item.unitId),
            role: item.role as "owner" | "tenant" | "family",
            isActive: item.isActive,
          },
          UniqueId.create(item.id),
          item.createdAt,
          item.updatedAt
        )
      );

      return success(residents);
    } catch (error) {
      return failure(
        new DatabaseError(
          error instanceof Error ? error.message : "Erro ao buscar moradores da unidade"
        )
      );
    }
  }

  async update(resident: Resident): Promise<Result<Resident>> {
    try {
      const data = await this.prisma.resident.update({
        where: { id: resident.id.value },
        data: {
          unitId: resident.unitId.value,
          role: resident.role,
          isActive: resident.isActive,
          updatedAt: resident.updatedAt,
        },
      });

      const updatedResident = Resident.restore(
        {
          userId: UniqueId.create(data.userId),
          unitId: UniqueId.create(data.unitId),
          role: data.role as "owner" | "tenant" | "family",
          isActive: data.isActive,
        },
        UniqueId.create(data.id),
        data.createdAt,
        data.updatedAt
      );

      return success(updatedResident);
    } catch (error) {
      return failure(
        new DatabaseError(
          error instanceof Error ? error.message : "Erro ao atualizar morador"
        )
      );
    }
  }

  async delete(id: UniqueId): Promise<Result<void>> {
    try {
      await this.prisma.resident.delete({
        where: { id: id.value },
      });
      return success(undefined);
    } catch (error) {
      return failure(
        new DatabaseError(
          error instanceof Error ? error.message : "Erro ao deletar morador"
        )
      );
    }
  }
}

