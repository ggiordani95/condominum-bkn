import { UserRepository } from "../../domain/repositories/UserRepository";
import { User, UserProps } from "../../domain/entities/User";
import { UserName } from "../../domain/value-objects/UserName";
import { HashedPassword } from "../../domain/value-objects/HashedPassword";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { failure, Result, success } from "../../../../core/shared/Result";
import { Email } from "../../../../core/shared/value-objects/Email";

// In-memory implementation for now
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<Result<User>> {
    try {
      this.users.set(user.id.value, user);
      return success(user);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findById(id: UniqueId): Promise<Result<User | null>> {
    try {
      const user = this.users.get(id.value) || null;
      return success(user);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findByEmail(email: Email): Promise<Result<User | null>> {
    try {
      const user =
        Array.from(this.users.values()).find((u) => u.email.equals(email)) ||
        null;
      return success(user);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<
    Result<{
      users: User[];
      total: number;
      page: number;
      limit: number;
    }>
  > {
    try {
      const allUsers = Array.from(this.users.values());
      const total = allUsers.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const users = allUsers.slice(startIndex, endIndex);

      return success({
        users,
        total,
        page,
        limit,
      });
    } catch (error) {
      return failure(error as Error);
    }
  }

  async delete(id: UniqueId): Promise<Result<void>> {
    try {
      this.users.delete(id.value);
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async exists(email: Email): Promise<Result<boolean>> {
    try {
      const user = Array.from(this.users.values()).find((u) =>
        u.email.equals(email)
      );
      return success(!!user);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
