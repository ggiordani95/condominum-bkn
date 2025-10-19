import { describe, it, expect, beforeEach } from "vitest";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { InMemoryUserRepository } from "../../../infrastructure/repositories/InMemoryUserRepository";
import { UserDomainService } from "../../../domain/services/UserDomainService";
import { CreateUserDTO } from "../../dtos/UserDTOs";

describe("CreateUserUseCase", () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let userDomainService: UserDomainService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userDomainService = new UserDomainService(userRepository);
    createUserUseCase = new CreateUserUseCase(
      userRepository,
      userDomainService
    );
  });

  it("deve criar um novo usuário com sucesso", async () => {
    const dto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const result = await createUserUseCase.execute(dto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value).toMatchObject({
        name: dto.name,
        email: dto.email,
        isActive: true,
      });
      expect(result.value.id).toBeDefined();
      expect(result.value.createdAt).toBeDefined();
      expect(result.value.updatedAt).toBeDefined();
    }
  });

  it("deve falhar quando o email é inválido", async () => {
    const dto: CreateUserDTO = {
      name: "John Doe",
      email: "invalid-email",
      password: "SecurePass123!",
    };

    const result = await createUserUseCase.execute(dto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("Invalid email");
    }
  });

  it("deve falhar quando o nome é muito curto", async () => {
    const dto: CreateUserDTO = {
      name: "J",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const result = await createUserUseCase.execute(dto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("Name");
    }
  });

  it("deve falhar quando o email já existe", async () => {
    const dto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    await createUserUseCase.execute(dto);
    const result = await createUserUseCase.execute(dto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("already exists");
    }
  });

  it("deve fazer hash da senha antes de salvar", async () => {
    const dto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    await createUserUseCase.execute(dto);
    
    const users = await userRepository.findAll(1, 10);
    
    if (users.isSuccess) {
      const user = users.value.users[0];
      expect(user.password.value).not.toBe(dto.password);
      expect(user.password.value.length).toBeGreaterThan(20);
    }
  });
});

