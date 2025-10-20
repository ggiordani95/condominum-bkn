import { describe, it, expect, beforeEach } from "vitest";
import { UpdateVisitorUseCase } from "../UpdateVisitorUseCase";
import { InMemoryVisitorRepository } from "../../../infrastructure/repositories/InMemoryVisitorRepository";
import { Visitor } from "../../../domain/entities/Visitor";
import { VisitorName } from "../../../domain/value-objects/VisitorName";
import { Document } from "../../../domain/value-objects/Document";
import { VehiclePlate } from "../../../domain/value-objects/VehiclePlate";
import { UniqueId } from "../../../../../core/shared/value-objects/UniqueId";
import { UpdateVisitorDTO } from "../../dtos/VisitorDTOs";

describe("UpdateVisitorUseCase", () => {
  let updateVisitorUseCase: UpdateVisitorUseCase;
  let visitorRepository: InMemoryVisitorRepository;

  beforeEach(() => {
    visitorRepository = new InMemoryVisitorRepository();
    updateVisitorUseCase = new UpdateVisitorUseCase(visitorRepository);
  });

  it("deve atualizar o nome do visitante", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("Nome Original"),
      Document.create("12345678900"),
      VehiclePlate.create("ABC-1234")
    );
    await visitorRepository.save(visitor);
    await visitorRepository.createResidentVisitor(residentId, visitor.id);

    const dto: UpdateVisitorDTO = {
      name: "Nome Atualizado",
    };

    const result = await updateVisitorUseCase.execute(visitor.id.value, dto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.name).toBe("Nome Atualizado");
      expect(result.value.document).toBe("12345678900");
      expect(result.value.vehicle_plate).toBe("ABC-1234"); 
    }
  });

  it("deve atualizar a placa do veículo", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("João Visitante"),
      Document.create("12345678900"),
      VehiclePlate.create("ABC-1234")
    );
    await visitorRepository.save(visitor);
    await visitorRepository.createResidentVisitor(residentId, visitor.id);

    const dto: UpdateVisitorDTO = {
      vehicle_plate: "XYZ-9988",
    };

    const result = await updateVisitorUseCase.execute(visitor.id.value, dto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.vehicle_plate).toBe("XYZ-9988");
      expect(result.value.name).toBe("João Visitante"); 
    }
  });

  it("deve atualizar nome e placa simultaneamente", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("Nome Original"),
      Document.create("12345678900"),
      VehiclePlate.create("ABC-1234")
    );
    await visitorRepository.save(visitor);
    await visitorRepository.createResidentVisitor(residentId, visitor.id);

    const dto: UpdateVisitorDTO = {
      name: "Nome Atualizado",
      vehicle_plate: "XYZ-9988",
    };

    const result = await updateVisitorUseCase.execute(visitor.id.value, dto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.name).toBe("Nome Atualizado");
      expect(result.value.vehicle_plate).toBe("XYZ-9988");
    }
  });

  it("deve manter a placa quando não for enviada no update", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("João Visitante"),
      Document.create("12345678900"),
      VehiclePlate.create("ABC-1234")
    );
    await visitorRepository.save(visitor);
    await visitorRepository.createResidentVisitor(residentId, visitor.id);

    const dto: UpdateVisitorDTO = {
      name: "Nome Atualizado",
    };

    const result = await updateVisitorUseCase.execute(visitor.id.value, dto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.vehicle_plate).toBe("ABC-1234");
      expect(result.value.name).toBe("Nome Atualizado");
    }
  });

  it("deve falhar quando visitante não existe", async () => {
    const dto: UpdateVisitorDTO = {
      name: "Nome Qualquer",
    };

    const result = await updateVisitorUseCase.execute("id-inexistente", dto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("Visitante não encontrado");
    }
  });

  it("deve falhar quando nome é inválido", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("João Visitante"),
      Document.create("12345678900"),
      null
    );
    await visitorRepository.save(visitor);
    await visitorRepository.createResidentVisitor(residentId, visitor.id);

    const dto: UpdateVisitorDTO = {
      name: "Jo", 
    };

    const result = await updateVisitorUseCase.execute(visitor.id.value, dto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("Nome do visitante");
    }
  });

  it("deve falhar quando placa é inválida", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("João Visitante"),
      Document.create("12345678900"),
      null
    );
    await visitorRepository.save(visitor);
    await visitorRepository.createResidentVisitor(residentId, visitor.id);

    const dto: UpdateVisitorDTO = {
      vehicle_plate: "INVALIDA",
    };

    const result = await updateVisitorUseCase.execute(visitor.id.value, dto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("placa");
    }
  });

  it("não deve permitir alteração do documento", async () => {
    const residentId = UniqueId.create();
    const unitId = UniqueId.create();
    visitorRepository.setResidentUnitId(residentId.value, unitId.value);

    const visitor = Visitor.create(
      VisitorName.create("João Visitante"),
      Document.create("12345678900"),
      null
    );
    await visitorRepository.save(visitor);
    await visitorRepository.createResidentVisitor(residentId, visitor.id);

    const dto: UpdateVisitorDTO = {
      name: "Nome Atualizado",
    };

    const result = await updateVisitorUseCase.execute(visitor.id.value, dto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.document).toBe("12345678900");
    }
  });
});

