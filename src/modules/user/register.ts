import { Container } from "../../core/container/Container";
import { InMemoryUserRepository } from "./infrastructure/repositories/InMemoryUserRepository";
import { UserDomainService } from "./domain/services/UserDomainService";
import { CreateUserUseCase } from "./application/use-cases/CreateUserUseCase";
import { GetUsersUseCase } from "./application/use-cases/GetUsersUseCase";

export function registerUserModule(container: Container) {
  // Infrastructure - usando InMemory temporariamente enquanto resolve problema do Prisma
  const userRepo = new InMemoryUserRepository();
  container.register("userRepository", userRepo);

  // Domain Services
  const userDomain = new UserDomainService(userRepo);
  container.register("userDomainService", userDomain);

  // Application Use Cases
  container.register(
    "createUserUseCase",
    new CreateUserUseCase(userRepo, userDomain)
  );

  container.register("getUsersUseCase", new GetUsersUseCase(userRepo));
}
