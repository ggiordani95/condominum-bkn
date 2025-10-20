import { describe, it, expect, beforeEach } from "vitest";
import { GetVisitorByIdUseCase } from "../GetVisitorByIdUseCase";
import { InMemoryVisitorRepository } from "../../../infrastructure/repositories/InMemoryVisitorRepository";
import { Visitor } from "../../../domain/entities/Visitor";
import { VisitorName } from "../../../domain/value-objects/VisitorName";
import { Document } from "../../../domain/value-objects/Document";
import { VehiclePlate } from "../../../domain/value-objects/VehiclePlate";
import { TimeLimit } from "../../../domain/value-objects/TimeLimit";
import { UniqueId } from "../../../../../core/shared/value-objects/UniqueId";

describe("GetVisitorByIdUseCase", () => {
  let getVisitorByIdUseCase: GetVisitorByIdUseCase;
  let visitorRepository: InMemoryVisitorRepository;

  beforeEach(() => {
    visitorRepository = new InMemoryVisitorRepository();
    getVisitorByIdUseCase = new GetVisitorByIdUseCase(visitorRepository);
  });

  it("deve retornar visitante quando encontrado", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("João Visitante"),
      Document.create("12345678900"),
      VehiclePlate.create("ABC-1234")
    );
    await visitorRepository.save(visitor);
    await visitorRepository.createResidentVisitor(residentId, visitor.id, TimeLimit.create("18:00"), 1);

    const result = await getVisitorByIdUseCase.execute(visitor.id.value);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess && result.value) {
      expect(result.value.id).toBe(visitor.id.value);
      expect(result.value.name).toBe("João Visitante");
      expect(result.value.document).toBe("12345678900");
      expect(result.value.vehicle_plate).toBe("ABC-1234");
      expect(result.value.resident_id).toBe(residentId.value);
      expect(result.value.resident_unit_id).toBe(unitId.value);
    }
  });

  it("deve retornar null quando visitante não existe", async () => {
    const result = await getVisitorByIdUseCase.execute("id-inexistente");

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value).toBeNull();
    }
  });

  it("deve retornar visitante sem placa de veículo", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("Maria Visitante"),
      Document.create("98765432100"),
      null
    );
    await visitorRepository.save(visitor);
    await visitorRepository.createResidentVisitor(residentId, visitor.id, TimeLimit.create("19:00"), 1);

    const result = await getVisitorByIdUseCase.execute(visitor.id.value);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess && result.value) {
      expect(result.value.vehicle_plate).toBeNull();
    }
  });

  it("deve incluir informações de expiração", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("João Visitante"),
      Document.create("12345678900"),
      null
    );
    await visitorRepository.save(visitor);
    const rvResult = await visitorRepository.createResidentVisitor(residentId, visitor.id, TimeLimit.create("17:00"), 1);

    const result = await getVisitorByIdUseCase.execute(visitor.id.value);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess && result.value && rvResult.isSuccess) {
      expect(result.value.created_at).toBeDefined();
      expect(result.value.expires_at).toEqual(rvResult.value.expiresAt);
    }
  });

  it("deve retornar null para visitante com vínculo expirado", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("João Visitante"),
      Document.create("12345678900"),
      null
    );
    await visitorRepository.save(visitor);
    
    const expiredRV = await visitorRepository.createResidentVisitor(residentId, visitor.id, TimeLimit.create("16:00"), 1);
    if (expiredRV.isSuccess) {
      const rv = expiredRV.value;
      (rv as any)._props.expiresAt = new Date(Date.now() - 1000); 
    }

    const result = await getVisitorByIdUseCase.execute(visitor.id.value);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value).toBeNull();
    }
  });
});

