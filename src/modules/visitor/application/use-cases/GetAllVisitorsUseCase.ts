import { VisitorRepository } from "../../domain/repositories/VisitorRepository";
import { VisitorListResponseDTO } from "../dtos/VisitorDTOs";
import { Result, success, failure } from "../../../../core/shared/Result";

export class GetAllVisitorsUseCase {
  constructor(private visitorRepository: VisitorRepository) {}

  public async execute(): Promise<Result<VisitorListResponseDTO[]>> {
    try {
      const result = await this.visitorRepository.findAll();

      if (result.isFailure) {
        return failure(result.error);
      }

      const visitors = result.value.map((item) => ({
        id: item.visitor.id.value,
        name: item.visitor.name.value,
        document: item.visitor.document.value,
        vehicle_plate: item.visitor.vehiclePlate?.value || null,
        resident_id: item.residentVisitor.residentId.value,
        resident_unit_id: item.residentUnitId,
        time_limit: item.residentVisitor.timeLimit.value,
        created_at: item.residentVisitor.createdAt,
        expires_at: item.residentVisitor.expiresAt,
        can_enter_now: item.residentVisitor.canEnterNow(),
      }));

      return success(visitors);
    } catch (error) {
      return failure(error as Error);
    }
  }
}

