import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserDomainService } from "../../domain/services/UserDomainService";
import { User } from "../../domain/entities/User";
import { UserName } from "../../domain/value-objects/UserName";
import { Email } from "../../../../core/shared/value-objects/Email";
import { HashedPassword } from "../../domain/value-objects/HashedPassword";
import { CreateUserDTO, UserResponseDTO } from "../dtos/UserDTOs";
import { Result, success, failure } from "../../../../core/shared/Result";
import { ValidationError } from "../../../../core/shared/errors/DomainErrors";

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userDomainService: UserDomainService
  ) {}

  public async execute(dto: CreateUserDTO): Promise<Result<UserResponseDTO>> {
    try {
      const name = UserName.create(dto.name);
      const email = Email.create(dto.email);
      const password = await HashedPassword.fromPlainText(dto.password);

      const emailCheckResult =
        await this.userDomainService.checkEmailUniqueness(email);
      if (emailCheckResult.isFailure) {
        return failure(emailCheckResult.error);
      }

      const user = User.create(name, email, password);

      const saveResult = await this.userRepository.save(user);
      if (saveResult.isFailure) {
        return failure(saveResult.error);
      }

      const userResponse: UserResponseDTO = {
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return success(userResponse);
    } catch (error) {
      return failure(
        new ValidationError(
          error instanceof Error ? error.message : "Dados de usuário inválidos"
        )
      );
    }
  }
}
