import { describe, it, expect, beforeEach } from "vitest";
import { GetUserByIdUseCase } from "../GetUserByIdUseCase";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { InMemoryUserRepository } from "../../../infrastructure/repositories/InMemoryUserRepository";
import { UserDomainService } from "../../../domain/services/UserDomainService";
import { CreateUserDTO } from "../../dtos/UserDTOs";

describe("GetUserByIdUseCase", () => {
  let getUserByIdUseCase: GetUserByIdUseCase;
  let createUserUseCase: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let userDomainService: UserDomainService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userDomainService = new UserDomainService(userRepository);
    getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(
      userRepository,
      userDomainService
    );
  });

  it("deve buscar um usuário por id com sucesso", async () => {
    const createDto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const createResult = await createUserUseCase.execute(createDto);
    if (!createResult.isSuccess) throw new Error("Failed to create user");
    const userId = createResult.value.id;

    const result = await getUserByIdUseCase.execute(userId);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value).toMatchObject({
        id: userId,
        name: createDto.name,
        email: createDto.email,
        isActive: true,
      });
    }
  });

  it("deve retornar null quando o usuário não existe", async () => {
    const result = await getUserByIdUseCase.execute("non-existent-id");

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value).toBeNull();
    }
  });
});

