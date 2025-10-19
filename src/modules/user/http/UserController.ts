import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserUseCase } from "../application/use-cases/CreateUserUseCase";
import { GetUsersUseCase } from "../application/use-cases/GetUsersUseCase";
import { CreateUserDTO } from "../application/dtos/UserDTOs";
import { HttpErrorHandler } from "./utils/HttpErrorHandler";

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUsersUseCase: GetUsersUseCase
  ) {}

  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const dto = request.body as CreateUserDTO;
      const result = await this.createUserUseCase.execute(dto);

      if (result.isFailure) {
        HttpErrorHandler.handleGenericError(reply, result.error);
        return;
      }

      reply.code(201).send(result.value);
    } catch (error) {
      request.log.error(
        { err: error },
        "Unhandled error in UserController.create"
      );
      HttpErrorHandler.handleInternalError(reply);
    }
  }

  public async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { page = 1, limit = 10 } = request.query as {
        page?: number;
        limit?: number;
      };

      const result = await this.getUsersUseCase.execute(
        Number(page),
        Number(limit)
      );

      if (result.isFailure) {
        HttpErrorHandler.handleGenericError(reply, result.error);
        return;
      }

      reply.send(result.value);
    } catch (error) {
      request.log.error(
        { err: error },
        "Unhandled error in UserController.getAll"
      );
      HttpErrorHandler.handleInternalError(reply);
    }
  }
}
