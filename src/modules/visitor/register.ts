import { Container } from "../../core/container/Container";
import { PrismaVisitorRepository } from "./infrastructure/repositories/PrismaVisitorRepository";
import { CreateVisitorUseCase } from "./application/use-cases/CreateVisitorUseCase";
import { GetAllVisitorsUseCase } from "./application/use-cases/GetAllVisitorsUseCase";
import { GetVisitorByIdUseCase } from "./application/use-cases/GetVisitorByIdUseCase";
import { UpdateVisitorUseCase } from "./application/use-cases/UpdateVisitorUseCase";
import { ResidentRepository } from "../resident/domain/repositories/ResidentRepository";

export function registerVisitorModule(container: Container) {
  const visitorRepo = new PrismaVisitorRepository();
  container.register("visitorRepository", visitorRepo);

  const residentRepo = container.get<ResidentRepository>("residentRepository");

  container.register(
    "createVisitorUseCase",
    new CreateVisitorUseCase(visitorRepo, residentRepo)
  );

  container.register(
    "getAllVisitorsUseCase",
    new GetAllVisitorsUseCase(visitorRepo)
  );

  container.register(
    "getVisitorByIdUseCase",
    new GetVisitorByIdUseCase(visitorRepo)
  );

  container.register(
    "updateVisitorUseCase",
    new UpdateVisitorUseCase(visitorRepo)
  );
}

