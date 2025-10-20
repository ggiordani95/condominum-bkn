import { describe, it, expect, beforeEach } from "vitest";
import { CreateVisitorUseCase } from "../CreateVisitorUseCase";
import { InMemoryVisitorRepository } from "../../../infrastructure/repositories/InMemoryVisitorRepository";
import { InMemoryResidentRepository } from "../../../../resident/infrastructure/repositories/InMemoryResidentRepository";
import { CreateVisitorDTO } from "../../dtos/VisitorDTOs";
import { Resident } from "../../../../resident/domain/entities/Resident";
import { UniqueId } from "../../../../../core/shared/value-objects/UniqueId";

describe("CreateVisitorUseCase", () => {
  let createVisitorUseCase: CreateVisitorUseCase;
  let visitorRepository: InMemoryVisitorRepository;
  let residentRepository: InMemoryResidentRepository;
  let testResident: Resident;

  beforeEach(async () => {
    visitorRepository = new InMemoryVisitorRepository();
    residentRepository = new InMemoryResidentRepository();
    createVisitorUseCase = new CreateVisitorUseCase(
      visitorRepository,
      residentRepository
    );

    const userId = UniqueId.create();
    const unitId = UniqueId.create();
    testResident = Resident.create(userId, unitId, "owner");
    await residentRepository.save(testResident);

    visitorRepository.setResidentUnitId(testResident.id.value, testResident.unitId.value);
  });

  it("deve criar um visitante com sucesso", async () => {
    const dto: CreateVisitorDTO = {
      name: "João Visitante",
      document: "12345678900",
      vehicle_plate: "ABC-1234",
      resident_id: testResident.id.value,
    };

    const result = await createVisitorUseCase.execute(dto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value).toMatchObject({
        name: dto.name,
        document: "12345678900",
        vehicle_plate: "ABC-1234",
        resident_id: testResident.id.value,
        resident_unit_id: testResident.unitId.value,
      });
      expect(result.value.id).toBeDefined();
      expect(result.value.created_at).toBeDefined();
      expect(result.value.expires_at).toBeDefined();
    }
  });

  it("deve criar visitante sem placa de veículo", async () => {
    const dto: CreateVisitorDTO = {
      name: "Maria Visitante",
      document: "98765432100",
      resident_id: testResident.id.value,
    };

    const result = await createVisitorUseCase.execute(dto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.vehicle_plate).toBeNull();
    }
  });

  it("deve limpar caracteres do documento automaticamente", async () => {
    const dto: CreateVisitorDTO = {
      name: "Pedro Visitante",
      document: "123.456.789-00",
      resident_id: testResident.id.value,
    };

    const result = await createVisitorUseCase.execute(dto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.document).toBe("12345678900");
    }
  });

  it("deve falhar quando o morador não existe", async () => {
    const dto: CreateVisitorDTO = {
      name: "João Visitante",
      document: "12345678900",
      resident_id: "id-invalido",
    };

    const result = await createVisitorUseCase.execute(dto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("Morador não encontrado");
    }
  });

  it("deve falhar quando o nome é inválido", async () => {
    const dto: CreateVisitorDTO = {
      name: "Jo",
      document: "12345678900",
      resident_id: testResident.id.value,
    };

    const result = await createVisitorUseCase.execute(dto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("Nome do visitante");
    }
  });

  it("deve falhar quando o documento é inválido", async () => {
    const dto: CreateVisitorDTO = {
      name: "João Visitante",
      document: "123",
      resident_id: testResident.id.value,
    };

    const result = await createVisitorUseCase.execute(dto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("Documento");
    }
  });

  it("deve falhar quando a placa do veículo é inválida", async () => {
    const dto: CreateVisitorDTO = {
      name: "João Visitante",
      document: "12345678900",
      vehicle_plate: "INVALIDA",
      resident_id: testResident.id.value,
    };

    const result = await createVisitorUseCase.execute(dto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("placa");
    }
  });

  it("deve definir expiração para 24 horas no futuro", async () => {
    const dto: CreateVisitorDTO = {
      name: "João Visitante",
      document: "12345678900",
      resident_id: testResident.id.value,
    };

    const beforeCreation = new Date();
    const result = await createVisitorUseCase.execute(dto);
    const afterCreation = new Date();

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      const expiresAt = new Date(result.value.expires_at);
      const expectedExpiry = new Date(beforeCreation);
      expectedExpiry.setHours(expectedExpiry.getHours() + 24);

      const diffHours = (expiresAt.getTime() - beforeCreation.getTime()) / (1000 * 60 * 60);
      expect(diffHours).toBeGreaterThanOrEqual(23.99);
      expect(diffHours).toBeLessThanOrEqual(24.01);
    }
  });
});

