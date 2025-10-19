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
      // Create email value object
      const email = Email.create(dto.email);

      // Find user by email
      const userResult = await this.userRepository.findByEmail(email);
      if (userResult.isFailure) {
        return failure(userResult.error);
      }

      const user = userResult.value;
      if (!user) {
        return failure(new UnauthorizedError("Invalid credentials"));
      }

      // Check if user is active
      if (!user.isValidForLogin()) {
        return failure(new UnauthorizedError("User is not active"));
      }

      // Verify password
      const isPasswordValid = await user.verifyPassword(dto.password);
      if (!isPasswordValid) {
        return failure(new UnauthorizedError("Invalid credentials"));
      }

      // Generate token
      const token = await this.tokenService.generateToken(
        user.id.value,
        user.email.value
      );

      // Return response
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
          error instanceof Error ? error.message : "Invalid login data"
        )
      );
    }
  }
}
