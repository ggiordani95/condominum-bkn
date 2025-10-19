import { FastifyRequest, FastifyReply } from "fastify";
import { LoginUseCase } from "../application/use-cases/LoginUseCase";
import { LoginDTO } from "../application/dtos/AuthDTOs";
import { HttpErrorHandler } from "../../user/http/utils/HttpErrorHandler";

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  public async login(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const dto = request.body as LoginDTO;
      const result = await this.loginUseCase.execute(dto);

      if (result.isFailure) {
        HttpErrorHandler.handleGenericError(reply, result.error);
        return;
      }

      reply.send(result.value);
    } catch (error) {
      request.log.error(
        { err: error },
        "Erro não tratado em AuthController.login"
      );
      HttpErrorHandler.handleInternalError(reply);
    }
  }

  public async register(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      // Por enquanto, retorna não implementado
      // Em uma aplicação real, você pode querer lógica de registro separada
      reply.code(501).send({
        error: {
          message: "Endpoint de registro não implementado ainda",
          code: "NOT_IMPLEMENTED",
          statusCode: 501,
        },
      });
    } catch (error) {
      request.log.error(
        { err: error },
        "Erro não tratado em AuthController.register"
      );
      HttpErrorHandler.handleInternalError(reply);
    }
  }
}
