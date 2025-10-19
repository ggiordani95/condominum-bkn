import { describe, it, expect, beforeEach } from "vitest";
import { UpdateUserUseCase } from "../UpdateUserUseCase";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { InMemoryUserRepository } from "../../../infrastructure/repositories/InMemoryUserRepository";
import { UserDomainService } from "../../../domain/services/UserDomainService";
import { CreateUserDTO, UpdateUserDTO } from "../../dtos/UserDTOs";

describe("UpdateUserUseCase", () => {
  let updateUserUseCase: UpdateUserUseCase;
  let createUserUseCase: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let userDomainService: UserDomainService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userDomainService = new UserDomainService(userRepository);
    updateUserUseCase = new UpdateUserUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(
      userRepository,
      userDomainService
    );
  });

  it("deve atualizar o nome do usuário com sucesso", async () => {
    const createDto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const createResult = await createUserUseCase.execute(createDto);
    if (!createResult.isSuccess) throw new Error("Failed to create user");
    const userId = createResult.value.id;

    const updateDto: UpdateUserDTO = {
      name: "Jane Doe",
    };

    const result = await updateUserUseCase.execute(userId, updateDto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.name).toBe(updateDto.name);
      expect(result.value.email).toBe(createDto.email);
    }
  });

  it("deve atualizar o email do usuário com sucesso", async () => {
    const createDto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const createResult = await createUserUseCase.execute(createDto);
    if (!createResult.isSuccess) throw new Error("Failed to create user");
    const userId = createResult.value.id;

    const updateDto: UpdateUserDTO = {
      email: "jane@example.com",
    };

    const result = await updateUserUseCase.execute(userId, updateDto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.email).toBe(updateDto.email);
      expect(result.value.name).toBe(createDto.name);
    }
  });

  it("deve atualizar a senha do usuário com sucesso", async () => {
    const createDto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const createResult = await createUserUseCase.execute(createDto);
    if (!createResult.isSuccess) throw new Error("Failed to create user");
    const userId = createResult.value.id;

    const updateDto: UpdateUserDTO = {
      password: "NewSecurePass456!",
    };

    const result = await updateUserUseCase.execute(userId, updateDto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.id).toBe(userId);
    }
  });

  it("deve falhar quando o usuário não existe", async () => {
    const updateDto: UpdateUserDTO = {
      name: "Jane Doe",
    };

    const result = await updateUserUseCase.execute("non-existent-id", updateDto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("não encontrado");
    }
  });

  it("deve falhar quando o email é inválido", async () => {
    const createDto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const createResult = await createUserUseCase.execute(createDto);
    if (!createResult.isSuccess) throw new Error("Failed to create user");
    const userId = createResult.value.id;

    const updateDto: UpdateUserDTO = {
      email: "invalid-email",
    };

    const result = await updateUserUseCase.execute(userId, updateDto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("Invalid email");
    }
  });
});

