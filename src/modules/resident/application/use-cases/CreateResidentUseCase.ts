
import { Result, success, failure } from "../../../../core/shared/Result";
import { ValidationError } from "../../../../core/shared/errors/DomainErrors";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { Resident } from "../../domain/entities/Resident";
import { ResidentRepository } from "../../domain/repositories/ResidentRepository";
import { CreateResidentDTO, ResidentResponseDTO } from "../dtos/ResidentDTOs";

export class CreateResidentUseCase {
  constructor(private residentRepository: ResidentRepository) {}

  async execute(dto: CreateResidentDTO): Promise<Result<ResidentResponseDTO>> {
    try {
      const userId = UniqueId.create(dto.user_id);
      const unitId = UniqueId.create(dto.unit_id);

      const existingResult = await this.residentRepository.findByUserId(userId);
      if (existingResult.isFailure) {
        return failure(existingResult.error);
      }

      if (existingResult.value) {
        return failure(new ValidationError("Usuário já é morador de uma unidade"));
      }

      const resident = Resident.create(userId, unitId, dto.role);

      const saveResult = await this.residentRepository.save(resident);
      if (saveResult.isFailure) {
        return failure(saveResult.error);
      }

      const savedResident = saveResult.value;

      const response: ResidentResponseDTO = {
        id: savedResident.id.value,
        user_id: savedResident.userId.value,
        unit_id: savedResident.unitId.value,
        role: savedResident.role,
        is_active: savedResident.isActive,
        created_at: savedResident.createdAt,
        updated_at: savedResident.updatedAt,
      };

      return success(response);
    } catch (error) {
      return failure(
        new ValidationError(
          error instanceof Error ? error.message : "Erro ao criar morador"
        )
      );
    }
  }
}

