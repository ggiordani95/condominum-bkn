import { User } from "../entities/User";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { Email } from "../../../../core/shared/value-objects/Email";
import { Result } from "../../../../core/shared/Result";

export interface UserRepository {
  save(user: User): Promise<Result<User>>;
  findById(id: UniqueId): Promise<Result<User | null>>;
  findByEmail(email: Email): Promise<Result<User | null>>;
  findAll(
    page: number,
    limit: number
  ): Promise<
    Result<{
      users: User[];
      total: number;
      page: number;
      limit: number;
    }>
  >;
  delete(id: UniqueId): Promise<Result<void>>;
  exists(email: Email): Promise<Result<boolean>>;
}
