import { Container } from "../../core/container/Container";
import { JWTTokenService } from "./infrastructure/services/JWTTokenService";
import { LoginUseCase } from "./application/use-cases/LoginUseCase";
import { UserRepository } from "../user/domain/repositories/UserRepository";

export function registerAuthModule(container: Container) {
  // Infrastructure services
  const tokenService = new JWTTokenService(
    process.env.JWT_SECRET || "supersecret"
  );
  container.register("tokenService", tokenService);

  // Application Use Cases (depends on userRepository from user module)
  const userRepo = container.get<UserRepository>("userRepository");
  container.register("loginUseCase", new LoginUseCase(userRepo, tokenService));
}
