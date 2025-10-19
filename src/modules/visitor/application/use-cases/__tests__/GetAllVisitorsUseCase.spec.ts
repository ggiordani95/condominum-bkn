import { describe, it, expect, beforeEach } from "vitest";
import { GetAllVisitorsUseCase } from "../GetAllVisitorsUseCase";
import { InMemoryVisitorRepository } from "../../../infrastructure/repositories/InMemoryVisitorRepository";
import { Visitor } from "../../../domain/entities/Visitor";
import { VisitorName } from "../../../domain/value-objects/VisitorName";
import { Document } from "../../../domain/value-objects/Document";
import { VehiclePlate } from "../../../domain/value-objects/VehiclePlate";
import { UniqueId } from "../../../../../core/shared/value-objects/UniqueId";

describe("GetAllVisitorsUseCase", () => {
  let getAllVisitorsUseCase: GetAllVisitorsUseCase;
  let visitorRepository: InMemoryVisitorRepository;

  beforeEach(() => {
    visitorRepository = new InMemoryVisitorRepository();
    getAllVisitorsUseCase = new GetAllVisitorsUseCase(visitorRepository);
  });

  it("deve retornar lista vazia quando não há visitantes", async () => {
    const result = await getAllVisitorsUseCase.execute();

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value).toEqual([]);
    }
  });

  it("deve retornar todos os visitantes ativos", async () => {
    const residentId = UniqueId.create();
    visitorRepository.setResidentName(residentId.value, "João Morador");

    const visitor1 = Visitor.create(
      VisitorName.create("Visitante 1"),
      Document.create("12345678900"),
      VehiclePlate.create("ABC-1234")
    );
    await visitorRepository.save(visitor1);
    await visitorRepository.createResidentVisitor(residentId, visitor1.id);

    const visitor2 = Visitor.create(
      VisitorName.create("Visitante 2"),
      Document.create("98765432100"),
      null
    );
    await visitorRepository.save(visitor2);
    await visitorRepository.createResidentVisitor(residentId, visitor2.id);

    const result = await getAllVisitorsUseCase.execute();

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value).toHaveLength(2);
      expect(result.value[0].name).toBe("Visitante 1");
      expect(result.value[1].name).toBe("Visitante 2");
    }
  });

  it("deve incluir informações do morador responsável", async () => {
    const residentId = UniqueId.create();
    const residentName = "João Morador";
    visitorRepository.setResidentName(residentId.value, residentName);

    const visitor = Visitor.create(
      VisitorName.create("João Visitante"),
      Document.create("12345678900"),
      null
    );
    await visitorRepository.save(visitor);
    await visitorRepository.createResidentVisitor(residentId, visitor.id);

    const result = await getAllVisitorsUseCase.execute();

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value[0].resident_name).toBe(residentName);
      expect(result.value[0].resident_id).toBe(residentId.value);
    }
  });

  it("deve incluir data de expiração", async () => {
    const residentId = UniqueId.create();
    visitorRepository.setResidentName(residentId.value, "João Morador");

    const visitor = Visitor.create(
      VisitorName.create("João Visitante"),
      Document.create("12345678900"),
      null
    );
    await visitorRepository.save(visitor);
    const residentVisitor = await visitorRepository.createResidentVisitor(residentId, visitor.id);

    const result = await getAllVisitorsUseCase.execute();

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess && residentVisitor.isSuccess) {
      expect(result.value[0].expires_at).toEqual(residentVisitor.value.expiresAt);
    }
  });

  it("deve ordenar visitantes por data de criação (mais recentes primeiro)", async () => {
    const residentId = UniqueId.create();
    visitorRepository.setResidentName(residentId.value, "João Morador");

    const visitor1 = Visitor.create(
      VisitorName.create("Primeiro Visitante"),
      Document.create("11111111111"),
      null
    );
    await visitorRepository.save(visitor1);
    await visitorRepository.createResidentVisitor(residentId, visitor1.id);

    await new Promise(resolve => setTimeout(resolve, 10));

    const visitor2 = Visitor.create(
      VisitorName.create("Segundo Visitante"),
      Document.create("22222222222"),
      null
    );
    await visitorRepository.save(visitor2);
    await visitorRepository.createResidentVisitor(residentId, visitor2.id);

    const result = await getAllVisitorsUseCase.execute();

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value).toHaveLength(2);
      expect(result.value[0].name).toBe("Segundo Visitante");
      expect(result.value[1].name).toBe("Primeiro Visitante");
    }
  });
});

