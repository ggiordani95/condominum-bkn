import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";
import { Email } from "../../../../core/shared/value-objects/Email";
import { Result, success, failure } from "../../../../core/shared/Result";
import { ConflictError } from "../../../../core/shared/errors/DomainErrors";

export class UserDomainService {
  constructor(private userRepository: UserRepository) {}

  public async checkEmailUniqueness(
    email: Email,
    excludeUserId?: string
  ): Promise<Result<void>> {
    const existingUserResult = await this.userRepository.findByEmail(email);

    if (existingUserResult.isFailure) {
      return failure(existingUserResult.error);
    }

    const existingUser = existingUserResult.value;

    if (
      existingUser &&
      (!excludeUserId || existingUser.id.value !== excludeUserId)
    ) {
      return failure(
        new ConflictError("Email already exists", { email: email.value })
      );
    }

    return success(undefined);
  }

  public async canUserBeDeleted(user: User): Promise<Result<boolean>> {
    // Business logic: Users can be deleted if they are not active
    // Add more complex business rules here as needed
    return success(!user.isActive);
  }
}
