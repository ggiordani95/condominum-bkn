import { bootstrapContainer } from "../../core/container/index";

export function initializeContainer() {
  const container = bootstrapContainer();

  console.log("📦 Container de injeção de dependência inicializado");

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
      throw new Error(`Serviço crítico '${service}' não encontrado no container`);
    }
  }

  return container;
}
