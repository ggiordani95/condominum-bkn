import { VisitorRepository } from "../../domain/repositories/VisitorRepository";
import { ResidentRepository } from "../../../resident/domain/repositories/ResidentRepository";
import { Visitor } from "../../domain/entities/Visitor";
import { VisitorName } from "../../domain/value-objects/VisitorName";
import { Document } from "../../domain/value-objects/Document";
import { VehiclePlate } from "../../domain/value-objects/VehiclePlate";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { CreateVisitorDTO, VisitorResponseDTO } from "../dtos/VisitorDTOs";
import { Result, success, failure } from "../../../../core/shared/Result";
import { ValidationError } from "../../../../core/shared/errors/DomainErrors";

export class CreateVisitorUseCase {
  constructor(
    private visitorRepository: VisitorRepository,
    private residentRepository: ResidentRepository
  ) {}

  public async execute(dto: CreateVisitorDTO): Promise<Result<VisitorResponseDTO>> {
    try {
      const residentId = UniqueId.create(dto.resident_id);
      const residentResult = await this.residentRepository.findById(residentId);
      
      if (residentResult.isFailure) {
        return failure(residentResult.error);
      }

      if (!residentResult.value) {
        return failure(new ValidationError("Morador não encontrado"));
      }

      const resident = residentResult.value;

      const name = VisitorName.create(dto.name);
      const document = Document.create(dto.document);
      const vehiclePlate = dto.vehicle_plate 
        ? VehiclePlate.create(dto.vehicle_plate) 
        : null;

      const visitor = Visitor.create(name, document, vehiclePlate);

      const saveResult = await this.visitorRepository.save(visitor);
      if (saveResult.isFailure) {
        return failure(saveResult.error);
      }

      const residentVisitorResult = await this.visitorRepository.createResidentVisitor(
        residentId,
        visitor.id
      );

      if (residentVisitorResult.isFailure) {
        return failure(residentVisitorResult.error);
      }

      const residentVisitor = residentVisitorResult.value;

      const visitorResponse: VisitorResponseDTO = {
        id: visitor.id.value,
        name: visitor.name.value,
        document: visitor.document.value,
        vehicle_plate: visitor.vehiclePlate?.value || null,
        resident_id: resident.id.value,
        resident_unit_id: resident.unitId.value,
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

