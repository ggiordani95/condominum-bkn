
import { describe, it, expect, beforeEach } from "vitest";
import { DeleteUserUseCase } from "../DeleteUserUseCase";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { GetUserByIdUseCase } from "../GetUserByIdUseCase";
import { InMemoryUserRepository } from "../../../infrastructure/repositories/InMemoryUserRepository";
import { UserDomainService } from "../../../domain/services/UserDomainService";
import { CreateUserDTO } from "../../dtos/UserDTOs";

describe("DeleteUserUseCase", () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let createUserUseCase: CreateUserUseCase;
  let getUserByIdUseCase: GetUserByIdUseCase;
  let userRepository: InMemoryUserRepository;
  let userDomainService: UserDomainService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userDomainService = new UserDomainService(userRepository);
    deleteUserUseCase = new DeleteUserUseCase(userRepository);
    getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    createUserUseCase = new CreateUserUseCase(
      userRepository,
      userDomainService
    );
  });

  it("deve deletar um usuário com sucesso", async () => {
    const createDto: CreateUserDTO = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    };

    const createResult = await createUserUseCase.execute(createDto);
    if (!createResult.isSuccess) throw new Error("Failed to create user");
    const userId = createResult.value.id;

    const deleteResult = await deleteUserUseCase.execute(userId);
    expect(deleteResult.isSuccess).toBe(true);

    const getUserResult = await getUserByIdUseCase.execute(userId);
    if (getUserResult.isSuccess) {
      expect(getUserResult.value).toBeNull();
    }
  });

  it("deve falhar quando o usuário não existe", async () => {
    const result = await deleteUserUseCase.execute("non-existent-id");

    expect(result.isFailure).toBe(true);
  });
});

