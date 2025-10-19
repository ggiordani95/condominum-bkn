// src/modules/user/application/use-cases/DeleteUserUseCase.ts
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { Result, success, failure } from "../../../../core/shared/Result";
import { ValidationError } from "../../../../core/shared/errors/DomainErrors";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(userId: string): Promise<Result<void>> {
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

      const deleteResult = await this.userRepository.delete(id);
      if (deleteResult.isFailure) {
        return failure(deleteResult.error);
      }

      return success(undefined);
    } catch (error) {
      return failure(
        new ValidationError(
          error instanceof Error ? error.message : "Falha ao deletar usuário"
        )
      );
    }
  }
}

