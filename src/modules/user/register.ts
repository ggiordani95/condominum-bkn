import { Container } from "../../core/container/Container";
import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { UserDomainService } from "./domain/services/UserDomainService";
import { CreateUserUseCase } from "./application/use-cases/CreateUserUseCase";
import { GetUsersUseCase } from "./application/use-cases/GetUsersUseCase";
import { GetUserByIdUseCase } from "./application/use-cases/GetUserByIdUseCase";
import { UpdateUserUseCase } from "./application/use-cases/UpdateUserUseCase";
import { DeleteUserUseCase } from "./application/use-cases/DeleteUserUseCase";

export function registerUserModule(container: Container) {
  const userRepo = new PrismaUserRepository();
  container.register("userRepository", userRepo);

  const userDomain = new UserDomainService(userRepo);
  container.register("userDomainService", userDomain);

  container.register(
    "createUserUseCase",
    new CreateUserUseCase(userRepo, userDomain)
  );

  container.register("getUsersUseCase", new GetUsersUseCase(userRepo));
  
  container.register(
    "getUserByIdUseCase",
    new GetUserByIdUseCase(userRepo)
  );
  
  container.register(
    "updateUserUseCase",
    new UpdateUserUseCase(userRepo)
  );
  
  container.register(
    "deleteUserUseCase",
    new DeleteUserUseCase(userRepo)
  );
}
