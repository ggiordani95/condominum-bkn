import { Result, success, failure } from "../../../../core/shared/Result";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { DatabaseError } from "../../../../core/shared/errors/DomainErrors";
import { Resident } from "../../domain/entities/Resident";
import { ResidentRepository } from "../../domain/repositories/ResidentRepository";

export class InMemoryResidentRepository implements ResidentRepository {
  private residents: Map<string, Resident> = new Map();

  async save(resident: Resident): Promise<Result<Resident>> {
    try {
      this.residents.set(resident.id.value, resident);
      return success(resident);
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
      const resident = this.residents.get(id.value) || null;
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
      const resident = Array.from(this.residents.values()).find(
        (r) => r.userId.value === userId.value
      );
      return success(resident || null);
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
      const residents = Array.from(this.residents.values()).filter(
        (r) => r.unitId.value === unitId.value
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
      if (!this.residents.has(resident.id.value)) {
        return failure(new DatabaseError("Morador não encontrado"));
      }
      this.residents.set(resident.id.value, resident);
      return success(resident);
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
      this.residents.delete(id.value);
      return success(undefined);
    } catch (error) {
      return failure(
        new DatabaseError(
          error instanceof Error ? error.message : "Erro ao deletar morador"
        )
      );
    }
  }

  clear(): void {
    this.residents.clear();
  }
}

