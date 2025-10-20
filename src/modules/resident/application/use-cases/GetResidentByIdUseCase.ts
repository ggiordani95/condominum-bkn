import { Result, success, failure } from "../../../../core/shared/Result";
import { ValidationError } from "../../../../core/shared/errors/DomainErrors";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { ResidentRepository } from "../../domain/repositories/ResidentRepository";
import { ResidentResponseDTO } from "../dtos/ResidentDTOs";

export class GetResidentByIdUseCase {
  constructor(private residentRepository: ResidentRepository) {}

  async execute(id: string): Promise<Result<ResidentResponseDTO | null>> {
    try {
      const residentId = UniqueId.create(id);
      const result = await this.residentRepository.findById(residentId);

      if (result.isFailure) {
        return failure(result.error);
      }

      if (!result.value) {
        return success(null);
      }

      const resident = result.value;

      const response: ResidentResponseDTO = {
        id: resident.id.value,
        user_id: resident.userId.value,
        unit_id: resident.unitId.value,
        role: resident.role,
        is_active: resident.isActive,
        created_at: resident.createdAt,
        updated_at: resident.updatedAt,
      };

      return success(response);
    } catch (error) {
      return failure(
        new ValidationError(
          error instanceof Error ? error.message : "Erro ao buscar morador"
        )
      );
    }
  }
}

