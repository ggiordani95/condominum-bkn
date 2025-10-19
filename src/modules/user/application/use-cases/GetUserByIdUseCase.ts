// src/modules/user/application/use-cases/GetUserByIdUseCase.ts
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { UserResponseDTO } from "../dtos/UserDTOs";
import { Result, success, failure } from "../../../../core/shared/Result";

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(userId: string): Promise<Result<UserResponseDTO | null>> {
    try {
      const id = UniqueId.create(userId);
      
      const userResult = await this.userRepository.findById(id);
      if (userResult.isFailure) {
        return failure(userResult.error);
      }

      const user = userResult.value;
      if (!user) {
        return success(null);
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
        error instanceof Error ? error : new Error("Falha ao buscar usuário")
      );
    }
  }
}

