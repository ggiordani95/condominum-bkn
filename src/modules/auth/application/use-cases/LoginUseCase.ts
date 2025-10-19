import { UserRepository } from "../../../user/domain/repositories/UserRepository";
import { Email } from "../../../../core/shared/value-objects/Email";
import { LoginDTO, LoginResponseDTO } from "../dtos/AuthDTOs";
import { Result, success, failure } from "../../../../core/shared/Result";
import {
  UnauthorizedError,
  ValidationError,
} from "../../../../core/shared/errors/DomainErrors";

export interface TokenService {
  generateToken(userId: string, email: string): Promise<string>;
}

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService
  ) {}

  public async execute(dto: LoginDTO): Promise<Result<LoginResponseDTO>> {
    try {
      // Criar value object de email
      const email = Email.create(dto.email);

      // Buscar usuário por email
      const userResult = await this.userRepository.findByEmail(email);
      if (userResult.isFailure) {
        return failure(userResult.error);
      }

      const user = userResult.value;
      if (!user) {
        return failure(new UnauthorizedError("Credenciais inválidas"));
      }

      // Verificar se usuário está ativo
      if (!user.isValidForLogin()) {
        return failure(new UnauthorizedError("Usuário não está ativo"));
      }

      // Verificar senha
      const isPasswordValid = await user.verifyPassword(dto.password);
      if (!isPasswordValid) {
        return failure(new UnauthorizedError("Credenciais inválidas"));
      }

      // Gerar token
      const token = await this.tokenService.generateToken(
        user.id.value,
        user.email.value
      );

      // Retornar resposta
      const response: LoginResponseDTO = {
        token,
        user: {
          id: user.id.value,
          name: user.name.value,
          email: user.email.value,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };

      return success(response);
    } catch (error) {
      return failure(
        new ValidationError(
          error instanceof Error ? error.message : "Dados de login inválidos"
        )
      );
    }
  }
}
