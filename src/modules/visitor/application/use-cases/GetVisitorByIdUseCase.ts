import { VisitorRepository } from "../../domain/repositories/VisitorRepository";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { VisitorResponseDTO } from "../dtos/VisitorDTOs";
import { Result, success, failure } from "../../../../core/shared/Result";

export class GetVisitorByIdUseCase {
  constructor(private visitorRepository: VisitorRepository) {}

  public async execute(id: string): Promise<Result<VisitorResponseDTO | null>> {
    try {
      const visitorId = UniqueId.create(id);
      const result = await this.visitorRepository.findByIdWithResident(visitorId);

      if (result.isFailure) {
        return failure(result.error);
      }

      if (!result.value) {
        return success(null);
      }

      const item = result.value;
      const visitorResponse: VisitorResponseDTO = {
        id: item.visitor.id.value,
        name: item.visitor.name.value,
        document: item.visitor.document.value,
        vehicle_plate: item.visitor.vehiclePlate?.value || null,
        resident_id: item.residentVisitor.residentId.value,
        resident_name: item.residentName,
        created_at: item.residentVisitor.createdAt,
        expires_at: item.residentVisitor.expiresAt,
      };

      return success(visitorResponse);
    } catch (error) {
      return failure(error as Error);
    }
  }
}

