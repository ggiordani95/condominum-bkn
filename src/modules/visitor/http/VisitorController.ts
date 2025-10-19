import { FastifyRequest, FastifyReply } from "fastify";
import { CreateVisitorUseCase } from "../application/use-cases/CreateVisitorUseCase";
import { GetAllVisitorsUseCase } from "../application/use-cases/GetAllVisitorsUseCase";
import { GetVisitorByIdUseCase } from "../application/use-cases/GetVisitorByIdUseCase";
import { UpdateVisitorUseCase } from "../application/use-cases/UpdateVisitorUseCase";
import { CreateVisitorDTO, UpdateVisitorDTO } from "../application/dtos/VisitorDTOs";
import { HttpErrorHandler } from "../../user/http/utils/HttpErrorHandler";

export class VisitorController {
  constructor(
    private createVisitorUseCase: CreateVisitorUseCase,
    private getAllVisitorsUseCase: GetAllVisitorsUseCase,
    private getVisitorByIdUseCase: GetVisitorByIdUseCase,
    private updateVisitorUseCase: UpdateVisitorUseCase
  ) {}

  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const dto = request.body as CreateVisitorDTO;
      const result = await this.createVisitorUseCase.execute(dto);

      if (result.isFailure) {
        HttpErrorHandler.handleGenericError(reply, result.error);
        return;
      }

      reply.code(201).send(result.value);
    } catch (error) {
      request.log.error(
        { err: error },
        "Erro não tratado em VisitorController.create"
      );
      HttpErrorHandler.handleInternalError(reply);
    }
  }

  public async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const result = await this.getAllVisitorsUseCase.execute();

      if (result.isFailure) {
        HttpErrorHandler.handleGenericError(reply, result.error);
        return;
      }

      reply.send(result.value);
    } catch (error) {
      request.log.error(
        { err: error },
        "Erro não tratado em VisitorController.getAll"
      );
      HttpErrorHandler.handleInternalError(reply);
    }
  }

  public async getById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params as { id: string };
      const result = await this.getVisitorByIdUseCase.execute(id);

      if (result.isFailure) {
        HttpErrorHandler.handleGenericError(reply, result.error);
        return;
      }

      if (!result.value) {
        reply.code(404).send({ error: "Visitante não encontrado" });
        return;
      }

      reply.send(result.value);
    } catch (error) {
      request.log.error(
        { err: error },
        "Erro não tratado em VisitorController.getById"
      );
      HttpErrorHandler.handleInternalError(reply);
    }
  }

  public async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params as { id: string };
      const dto = request.body as UpdateVisitorDTO;

      const result = await this.updateVisitorUseCase.execute(id, dto);

      if (result.isFailure) {
        HttpErrorHandler.handleGenericError(reply, result.error);
        return;
      }

      reply.send(result.value);
    } catch (error) {
      request.log.error(
        { err: error },
        "Erro não tratado em VisitorController.update"
      );
      HttpErrorHandler.handleInternalError(reply);
    }
  }
}

