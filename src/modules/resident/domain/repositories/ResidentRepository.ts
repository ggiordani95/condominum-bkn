
import { Result } from "../../../../core/shared/Result";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { Resident } from "../entities/Resident";

export interface ResidentRepository {
  save(resident: Resident): Promise<Result<Resident>>;
  findById(id: UniqueId): Promise<Result<Resident | null>>;
  findByUserId(userId: UniqueId): Promise<Result<Resident | null>>;
  findByUnitId(unitId: UniqueId): Promise<Result<Resident[]>>;
  update(resident: Resident): Promise<Result<Resident>>;
  delete(id: UniqueId): Promise<Result<void>>;
}

