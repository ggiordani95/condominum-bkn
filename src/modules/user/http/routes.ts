import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { UserController } from "./UserController";
import { container } from "../../../core/container/index";
import { CreateUserUseCase } from "../application/use-cases/CreateUserUseCase";
import { GetUsersUseCase } from "../application/use-cases/GetUsersUseCase";
import { GetUserByIdUseCase } from "../application/use-cases/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../application/use-cases/UpdateUserUseCase";
import { DeleteUserUseCase } from "../application/use-cases/DeleteUserUseCase";
import { TokenService } from "../../auth/application/use-cases/LoginUseCase";

const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const createUserUseCase =
    container.get<CreateUserUseCase>("createUserUseCase");
  const getUsersUseCase = container.get<GetUsersUseCase>("getUsersUseCase");
  const getUserByIdUseCase =
    container.get<GetUserByIdUseCase>("getUserByIdUseCase");
  const updateUserUseCase =
    container.get<UpdateUserUseCase>("updateUserUseCase");
  const deleteUserUseCase =
    container.get<DeleteUserUseCase>("deleteUserUseCase");
  const tokenService = container.get<TokenService>("tokenService");

  const userController = new UserController(
    createUserUseCase,
    getUsersUseCase,
    getUserByIdUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    tokenService
  );

  const requireAuth = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  };

  fastify.get(
    "/",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Users"],
        summary: "List all users",
        description: "Retrieve a paginated list of all users",
        querystring: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              minimum: 1,
              default: 1,
              description: "Page number for pagination",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
              description: "Number of users per page",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              users: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    email: { type: "string" },
                    isActive: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
              total: { type: "number" },
              page: { type: "number" },
              limit: { type: "number" },
              totalPages: { type: "number" },
            },
          },
        },
      },
    },
    userController.getAll.bind(userController)
  );

  fastify.post(
    "/",
    {
      schema: {
        tags: ["Users"],
        summary: "Create a new user",
        description: "Creates a new user with the provided information",
        body: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "User's password (minimum 6 characters)",
            },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              token: { type: "string", description: "JWT token para autenticação" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                  isActive: { type: "boolean" },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
    userController.create.bind(userController)
  );

  fastify.get(
    "/:id",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Users"],
        summary: "Get user by ID",
        description: "Retrieve a specific user by their ID",
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "User ID" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              isActive: { type: "boolean" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    userController.getById.bind(userController)
  );

  fastify.put(
    "/:id",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Users"],
        summary: "Update user",
        description: "Update user information",
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "User ID" },
          },
        },
        body: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "User's password (minimum 6 characters)",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              isActive: { type: "boolean" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    userController.update.bind(userController)
  );

  fastify.delete(
    "/:id",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Users"],
        summary: "Delete user",
        description: "Delete a user by their ID",
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "User ID" },
          },
        },
        response: {
          204: {
            type: "null",
            description: "User successfully deleted",
          },
        },
      },
    },
    userController.delete.bind(userController)
  );
};

export default userRoutes;
