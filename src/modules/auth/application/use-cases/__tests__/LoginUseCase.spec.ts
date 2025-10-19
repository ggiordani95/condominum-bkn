// src/modules/auth/application/use-cases/__tests__/LoginUseCase.spec.ts
import { describe, it, expect, beforeEach } from "vitest";
import { LoginUseCase, TokenService } from "../LoginUseCase";
import { CreateUserUseCase } from "../../../../user/application/use-cases/CreateUserUseCase";
import { InMemoryUserRepository } from "../../../../user/infrastructure/repositories/InMemoryUserRepository";
import { UserDomainService } from "../../../../user/domain/services/UserDomainService";
import { LoginDTO } from "../../dtos/AuthDTOs";
import { CreateUserDTO } from "../../../../user/application/dtos/UserDTOs";

class MockTokenService implements TokenService {
  async generateToken(userId: string, email: string): Promise<string> {
    return `mock-token-${userId}-${email}`;
  }
}

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;
  let createUserUseCase: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let userDomainService: UserDomainService;
  let tokenService: TokenService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userDomainService = new UserDomainService(userRepository);
    tokenService = new MockTokenService();
    loginUseCase = new LoginUseCase(userRepository, tokenService);
    createUserUseCase = new CreateUserUseCase(
      userRepository,
      userDomainService
    );
  });

  it("deve fazer login com sucesso com credenciais corretas", async () => {
    const createDto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    await createUserUseCase.execute(createDto);

    const loginDto: LoginDTO = {
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const result = await loginUseCase.execute(loginDto);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.token).toBeDefined();
      expect(result.value.user).toMatchObject({
        name: createDto.name,
        email: createDto.email,
        isActive: true,
      });
    }
  });

  it("deve falhar quando o email não existe", async () => {
    const loginDto: LoginDTO = {
      email: "nonexistent@example.com",
      password: "SecurePass123!",
    };

    const result = await loginUseCase.execute(loginDto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("Credenciais inválidas");
    }
  });

  it("deve falhar quando a senha está incorreta", async () => {
    const createDto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    await createUserUseCase.execute(createDto);

    const loginDto: LoginDTO = {
      email: "john@example.com",
      password: "WrongPassword",
    };

    const result = await loginUseCase.execute(loginDto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("Credenciais inválidas");
    }
  });

  it("deve falhar quando o usuário está inativo", async () => {
    const createDto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const createResult = await createUserUseCase.execute(createDto);
    const users = await userRepository.findAll(1, 10);
    if (!users.isSuccess) throw new Error("Failed to find users");
    
    const user = users.value.users[0];
    user.deactivate();
    await userRepository.save(user);

    const loginDto: LoginDTO = {
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const result = await loginUseCase.execute(loginDto);

    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain("não está ativo");
    }
  });

  it("deve falhar com formato de email inválido", async () => {
    const loginDto: LoginDTO = {
      email: "invalid-email",
      password: "SecurePass123!",
    };

    const result = await loginUseCase.execute(loginDto);

    expect(result.isFailure).toBe(true);
  });
});

