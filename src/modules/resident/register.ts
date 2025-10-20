import { Container } from "../../core/container/Container";
import { PrismaResidentRepository } from "./infrastructure/repositories/PrismaResidentRepository";
import { CreateResidentUseCase } from "./application/use-cases/CreateResidentUseCase";
import { GetResidentByIdUseCase } from "./application/use-cases/GetResidentByIdUseCase";

export function registerResidentModule(container: Container): void {
  const residentRepository = new PrismaResidentRepository();

  container.register("residentRepository", residentRepository);
  container.register("createResidentUseCase", new CreateResidentUseCase(residentRepository));
  container.register("getResidentByIdUseCase", new GetResidentByIdUseCase(residentRepository));
}

