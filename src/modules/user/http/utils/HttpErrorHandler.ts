import { FastifyReply } from "fastify";
import {
  DomainError,
  ValidationError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../core/shared/errors/DomainErrors";

export class HttpErrorHandler {
  public static handleDomainError(
    reply: FastifyReply,
    error: DomainError
  ): void {
    if (error instanceof ValidationError) {
      reply.code(400).send({
        error: {
          message: error.message,
          code: "VALIDATION_ERROR",
          statusCode: 400,
          details: error.details,
        },
      });
      return;
    }

    if (error instanceof ConflictError) {
      reply.code(409).send({
        error: {
          message: error.message,
          code: "CONFLICT_ERROR",
          statusCode: 409,
          details: error.details,
        },
      });
      return;
    }

    if (error instanceof NotFoundError) {
      reply.code(404).send({
        error: {
          message: error.message,
          code: "NOT_FOUND_ERROR",
          statusCode: 404,
          details: error.details,
        },
      });
      return;
    }

    if (error instanceof UnauthorizedError) {
      reply.code(401).send({
        error: {
          message: error.message,
          code: "UNAUTHORIZED_ERROR",
          statusCode: 401,
          details: error.details,
        },
      });
      return;
    }

    // Default domain error handling
    reply.code(400).send({
      error: {
        message: error.message,
        code: "DOMAIN_ERROR",
        statusCode: 400,
        details: error.details,
      },
    });
  }

  public static handleInternalError(reply: FastifyReply): void {
    reply.code(500).send({
      error: {
        message: "Internal server error",
        code: "INTERNAL_ERROR",
        statusCode: 500,
      },
    });
  }

  public static handleGenericError(reply: FastifyReply, error: any): void {
    if (error instanceof DomainError) {
      this.handleDomainError(reply, error);
      return;
    }

    this.handleInternalError(reply);
  }
}
