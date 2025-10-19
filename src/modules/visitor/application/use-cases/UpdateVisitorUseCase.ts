import { VisitorRepository } from "../../domain/repositories/VisitorRepository";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { VisitorName } from "../../domain/value-objects/VisitorName";
import { VehiclePlate } from "../../domain/value-objects/VehiclePlate";
import { UpdateVisitorDTO, VisitorResponseDTO } from "../dtos/VisitorDTOs";
import { Result, success, failure } from "../../../../core/shared/Result";
import { ValidationError } from "../../../../core/shared/errors/DomainErrors";

export class UpdateVisitorUseCase {
  constructor(private visitorRepository: VisitorRepository) {}

  public async execute(
    id: string,
    dto: UpdateVisitorDTO
  ): Promise<Result<VisitorResponseDTO>> {
    try {
      const visitorId = UniqueId.create(id);
      
      const visitorResult = await this.visitorRepository.findByIdWithResident(visitorId);

      if (visitorResult.isFailure) {
        return failure(visitorResult.error);
      }

      if (!visitorResult.value) {
        return failure(new ValidationError("Visitante não encontrado"));
      }

      const { visitor, residentVisitor, residentName } = visitorResult.value;

      if (dto.name) {
        const name = VisitorName.create(dto.name);
        visitor.updateName(name);
      }

      if (dto.vehicle_plate !== undefined) {
        const vehiclePlate = dto.vehicle_plate
          ? VehiclePlate.create(dto.vehicle_plate)
          : null;
        visitor.updateVehiclePlate(vehiclePlate);
      }

      const saveResult = await this.visitorRepository.save(visitor);
      if (saveResult.isFailure) {
        return failure(saveResult.error);
      }

      const visitorResponse: VisitorResponseDTO = {
        id: visitor.id.value,
        name: visitor.name.value,
        document: visitor.document.value,
        vehicle_plate: visitor.vehiclePlate?.value || null,
        resident_id: residentVisitor.residentId.value,
        resident_name: residentName,
        created_at: residentVisitor.createdAt,
        expires_at: residentVisitor.expiresAt,
      };

      return success(visitorResponse);
    } catch (error) {
      return failure(
        new ValidationError(
          error instanceof Error ? error.message : "Dados do visitante inválidos"
        )
      );
    }
  }
}

