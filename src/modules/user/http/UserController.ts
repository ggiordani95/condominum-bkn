import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserUseCase } from "../application/use-cases/CreateUserUseCase";
import { GetUsersUseCase } from "../application/use-cases/GetUsersUseCase";
import { GetUserByIdUseCase } from "../application/use-cases/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../application/use-cases/UpdateUserUseCase";
import { DeleteUserUseCase } from "../application/use-cases/DeleteUserUseCase";
import { CreateUserDTO, UpdateUserDTO } from "../application/dtos/UserDTOs";
import { HttpErrorHandler } from "./utils/HttpErrorHandler";
import { TokenService } from "../../auth/application/use-cases/LoginUseCase";

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUsersUseCase: GetUsersUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private tokenService: TokenService
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

      // Gera token JWT para auto-login após criação
      const token = await this.tokenService.generateToken(
        result.value.id,
        result.value.email
      );

      reply.code(201).send({
        token,
        user: result.value,
      });
    } catch (error) {
      request.log.error(
        { err: error },
        "Erro não tratado em UserController.create"
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
        "Erro não tratado em UserController.getAll"
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
      const result = await this.getUserByIdUseCase.execute(id);

      if (result.isFailure) {
        HttpErrorHandler.handleGenericError(reply, result.error);
        return;
      }

      if (!result.value) {
        reply.code(404).send({ error: "Usuário não encontrado" });
        return;
      }

      reply.send(result.value);
    } catch (error) {
      request.log.error(
        { err: error },
        "Erro não tratado em UserController.getById"
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
      const dto = request.body as UpdateUserDTO;
      
      const result = await this.updateUserUseCase.execute(id, dto);

      if (result.isFailure) {
        HttpErrorHandler.handleGenericError(reply, result.error);
        return;
      }

      reply.send(result.value);
    } catch (error) {
      request.log.error(
        { err: error },
        "Erro não tratado em UserController.update"
      );
      HttpErrorHandler.handleInternalError(reply);
    }
  }

  public async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { id } = request.params as { id: string };
      const result = await this.deleteUserUseCase.execute(id);

      if (result.isFailure) {
        HttpErrorHandler.handleGenericError(reply, result.error);
        return;
      }

      reply.code(204).send();
    } catch (error) {
      request.log.error(
        { err: error },
        "Erro não tratado em UserController.delete"
      );
      HttpErrorHandler.handleInternalError(reply);
    }
  }
}
