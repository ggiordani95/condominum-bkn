import { describe, it, expect, beforeEach } from "vitest";
import { CreateVisitorUseCase } from "../CreateVisitorUseCase";
import { InMemoryVisitorRepository } from "../../../infrastructure/repositories/InMemoryVisitorRepository";
import { InMemoryUserRepository } from "../../../../user/infrastructure/repositories/InMemoryUserRepository";
import { CreateVisitorDTO } from "../../dtos/VisitorDTOs";
import { User } from "../../../../user/domain/entities/User";
import { UserName } from "../../../../user/domain/value-objects/UserName";
import { Email } from "../../../../../core/shared/value-objects/Email";
import { HashedPassword } from "../../../../user/domain/value-objects/HashedPassword";

describe("CreateVisitorUseCase", () => {
  let createVisitorUseCase: CreateVisitorUseCase;
  let visitorRepository: InMemoryVisitorRepository;
  let userRepository: InMemoryUserRepository;
  let testResident: User;

  beforeEach(async () => {
    visitorRepository = new InMemoryVisitorRepository();
    userRepository = new InMemoryUserRepository();
    createVisitorUseCase = new CreateVisitorUseCase(
      visitorRepository,
      userRepository
    );

    const name = UserName.create("João Morador");
    const email = Email.create("morador@example.com");
    const password = await HashedPassword.fromPlainText("senha123");
    testResident = User.create(name, email, password);
    await userRepository.save(testResident);

    visitorRepository.setResidentName(testResident.id.value, testResident.name.value);
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
        resident_name: testResident.name.value,
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

