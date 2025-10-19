import { UserRepository } from "../../domain/repositories/UserRepository";
import { PaginatedUsersDTO } from "../dtos/UserDTOs";
import { Result, success, failure } from "../../../../core/shared/Result";
import { ValidationError } from "../../../../core/shared/errors/DomainErrors";

export class GetUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(
    page: number = 1,
    limit: number = 10
  ): Promise<Result<PaginatedUsersDTO>> {
    try {
      // Validate pagination parameters
      if (page < 1) {
        return failure(new ValidationError("Page must be greater than 0"));
      }

      if (limit < 1 || limit > 100) {
        return failure(new ValidationError("Limit must be between 1 and 100"));
      }

      // Get users from repository
      const result = await this.userRepository.findAll(page, limit);
      if (result.isFailure) {
        return failure(result.error);
      }

      const { users, total } = result.value;

      // Convert to DTOs
      const userDTOs = users.map((user) => ({
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      const response: PaginatedUsersDTO = {
        users: userDTOs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      return success(response);
    } catch (error) {
      return failure(
        new ValidationError(
          error instanceof Error ? error.message : "Failed to get users"
        )
      );
    }
  }
}
