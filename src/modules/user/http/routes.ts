import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { UserController } from "./UserController";
import { container } from "../../../core/container/index";
import { CreateUserUseCase } from "../application/use-cases/CreateUserUseCase";
import { GetUsersUseCase } from "../application/use-cases/GetUsersUseCase";

const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Get use cases from container
  const createUserUseCase =
    container.get<CreateUserUseCase>("createUserUseCase");
  const getUsersUseCase = container.get<GetUsersUseCase>("getUsersUseCase");

  // Create controller
  const userController = new UserController(createUserUseCase, getUsersUseCase);

  // Authentication middleware for all routes
  fastify.addHook("preHandler", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // GET /users - List users
  fastify.get(
    "/",
    {
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

  // POST /users - Create user
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
    userController.create.bind(userController)
  );
};

export default userRoutes;
