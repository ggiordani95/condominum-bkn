import { bootstrapContainer } from "../../core/container/index";

export function initializeContainer() {
  // Initialize the modular container
  const container = bootstrapContainer();

  console.log("📦 Dependency injection container initialized");

  // Validate that critical services are registered
  const criticalServices = [
    "userRepository",
    "tokenService",
    "userDomainService",
    "createUserUseCase",
    "loginUseCase",
    "getUsersUseCase",
  ];

  for (const service of criticalServices) {
    try {
      container.get(service);
    } catch (error) {
      throw new Error(`Critical service '${service}' not found in container`);
    }
  }

  return container;
}
