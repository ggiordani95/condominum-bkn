// src/modules/user/application/use-cases/UpdateUserUseCase.ts
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { Email } from "../../../../core/shared/value-objects/Email";
import { UserName } from "../../domain/value-objects/UserName";
import { UpdateUserDTO, UserResponseDTO } from "../dtos/UserDTOs";
import { Result, success, failure } from "../../../../core/shared/Result";
import { ValidationError } from "../../../../core/shared/errors/DomainErrors";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(
    userId: string,
    dto: UpdateUserDTO
  ): Promise<Result<UserResponseDTO>> {
    try {
      const id = UniqueId.create(userId);

      const userResult = await this.userRepository.findById(id);
      if (userResult.isFailure) {
        return failure(userResult.error);
      }

      const user = userResult.value;
      if (!user) {
        return failure(new ValidationError("Usuário não encontrado"));
      }

      if (dto.name) {
        const name = UserName.create(dto.name);
        user.updateName(name);
      }

      if (dto.email) {
        const email = Email.create(dto.email);
        user.updateEmail(email);
      }

      if (dto.password) {
        await user.updatePassword(dto.password);
      }

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
          error instanceof Error ? error.message : "Falha ao atualizar usuário"
        )
      );
    }
  }
}

