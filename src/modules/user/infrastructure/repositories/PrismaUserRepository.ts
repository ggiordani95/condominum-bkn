import { UserRepository } from "../../domain/repositories/UserRepository";
import { User, UserProps } from "../../domain/entities/User";
import { UniqueId } from "../../../../core/shared/value-objects/UniqueId";
import { Email } from "../../../../core/shared/value-objects/Email";
import { UserName } from "../../domain/value-objects/UserName";
import { HashedPassword } from "../../domain/value-objects/HashedPassword";
import { Result, success, failure } from "../../../../core/shared/Result";
import { prisma } from "../../../../main/database/adapter";

export class PrismaUserRepository implements UserRepository {
  private prisma = prisma;
  async save(user: User): Promise<Result<User>> {
    try {
      const userData = {
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
        password: user.password.value,
        isActive: user.isActive,
        deletedAt: user.deletedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      const existingUser = await this.prisma.user.findUnique({
        where: { id: user.id.value },
      });

      let savedUser;
      if (existingUser) {
        savedUser = await this.prisma.user.update({
          where: { id: user.id.value },
          data: {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            isActive: userData.isActive,
            deletedAt: userData.deletedAt,
            updatedAt: userData.updatedAt,
          },
        });
      } else {
        savedUser = await this.prisma.user.create({
          data: userData,
        });
      }

      const domainUser = User.restore(
        {
          name: UserName.create(savedUser.name),
          email: Email.create(savedUser.email),
          password: HashedPassword.create(savedUser.password),
          isActive: savedUser.isActive,
        },
        UniqueId.create(savedUser.id),
        savedUser.createdAt,
        savedUser.updatedAt,
        savedUser.deletedAt
      );

      return success(domainUser);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findById(id: UniqueId): Promise<Result<User | null>> {
    try {
      const userData = await this.prisma.user.findFirst({
        where: { 
          id: id.value,
          deletedAt: null
        },
      });

      if (!userData) {
        return success(null);
      }

      const domainUser = User.restore(
        {
          name: UserName.create(userData.name),
          email: Email.create(userData.email),
          password: HashedPassword.create(userData.password),
          isActive: userData.isActive,
        },
        UniqueId.create(userData.id),
        userData.createdAt,
        userData.updatedAt,
        userData.deletedAt
      );

      return success(domainUser);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async findByEmail(email: Email): Promise<Result<User | null>> {
    try {
      const userData = await this.prisma.user.findFirst({
        where: { 
          email: email.value,
          deletedAt: null
        },
      });

      if (!userData) {
        return success(null);
      }

      const domainUser = User.restore(
        {
          name: UserName.create(userData.name),
          email: Email.create(userData.email),
          password: HashedPassword.create(userData.password),
          isActive: userData.isActive,
        },
        UniqueId.create(userData.id),
        userData.createdAt,
        userData.updatedAt,
        userData.deletedAt
      );

      return success(domainUser);
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
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where: { deletedAt: null },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        this.prisma.user.count({ where: { deletedAt: null } }),
      ]);

      const domainUsers = users.map((userData) =>
        User.restore(
          {
            name: UserName.create(userData.name),
            email: Email.create(userData.email),
            password: HashedPassword.create(userData.password),
            isActive: userData.isActive,
          },
          UniqueId.create(userData.id),
          userData.createdAt,
          userData.updatedAt,
          userData.deletedAt
        )
      );

      return success({
        users: domainUsers,
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
      await this.prisma.user.update({
        where: { id: id.value },
        data: { deletedAt: new Date() }
      });
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }

  async exists(email: Email): Promise<Result<boolean>> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { 
          email: email.value,
          deletedAt: null
        },
        select: { id: true },
      });
      return success(!!user);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
