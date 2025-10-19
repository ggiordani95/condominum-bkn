import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { AuthController } from "./AuthController";
import { container } from "../../../core/container/index";
import { LoginUseCase } from "../application/use-cases/LoginUseCase";

const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Get use case from container
  const loginUseCase = container.get<LoginUseCase>("loginUseCase");

  // Create controller
  const authController = new AuthController(loginUseCase);

  // POST /auth/login - Login
  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "User login",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            password: {
              type: "string",
              description: "User password",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              token: { type: "string" },
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
    authController.login.bind(authController)
  );

  // POST /auth/register - Register (placeholder)
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "User registration (not implemented)",
        body: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        response: {
          501: {
            type: "object",
            properties: {
              error: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  code: { type: "string" },
                  statusCode: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
    authController.register.bind(authController)
  );
};

export default authRoutes;
