import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { VisitorController } from "./VisitorController";
import { container } from "../../../core/container/index";
import { CreateVisitorUseCase } from "../application/use-cases/CreateVisitorUseCase";
import { GetAllVisitorsUseCase } from "../application/use-cases/GetAllVisitorsUseCase";
import { GetVisitorByIdUseCase } from "../application/use-cases/GetVisitorByIdUseCase";
import { UpdateVisitorUseCase } from "../application/use-cases/UpdateVisitorUseCase";

const visitorRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const createVisitorUseCase = container.get<CreateVisitorUseCase>("createVisitorUseCase");
  const getAllVisitorsUseCase = container.get<GetAllVisitorsUseCase>("getAllVisitorsUseCase");
  const getVisitorByIdUseCase = container.get<GetVisitorByIdUseCase>("getVisitorByIdUseCase");
  const updateVisitorUseCase = container.get<UpdateVisitorUseCase>("updateVisitorUseCase");

  const visitorController = new VisitorController(
    createVisitorUseCase,
    getAllVisitorsUseCase,
    getVisitorByIdUseCase,
    updateVisitorUseCase
  );

  const requireAuth = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  };

  fastify.post(
    "/",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Visitantes"],
        summary: "Adicionar novo visitante",
        description: "Cria um novo visitante e o vincula a um morador por 24 horas",
        body: {
          type: "object",
          required: ["name", "document", "resident_id"],
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 100,
              description: "Nome completo do visitante",
            },
            document: {
              type: "string",
              minLength: 11,
              description: "Documento do visitante (CPF)",
            },
            vehicle_plate: {
              type: "string",
              description: "Placa do veículo (opcional)",
            },
            resident_id: {
              type: "string",
              description: "ID do morador responsável",
            },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              document: { type: "string" },
              vehicle_plate: { type: ["string", "null"] },
              resident_id: { type: "string" },
              resident_name: { type: "string" },
              created_at: { type: "string", format: "date-time" },
              expires_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    visitorController.create.bind(visitorController)
  );

  fastify.get(
    "/",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Visitantes"],
        summary: "Listar visitantes ativos",
        description: "Retorna todos os visitantes ativos do condomínio com informações do morador responsável",
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                document: { type: "string" },
                vehicle_plate: { type: ["string", "null"] },
                resident_id: { type: "string" },
                resident_name: { type: "string" },
                created_at: { type: "string", format: "date-time" },
                expires_at: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    visitorController.getAll.bind(visitorController)
  );

  fastify.get(
    "/:id",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Visitantes"],
        summary: "Buscar visitante por ID",
        description: "Retorna informações completas de um visitante específico",
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID do visitante" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              document: { type: "string" },
              vehicle_plate: { type: ["string", "null"] },
              resident_id: { type: "string" },
              resident_name: { type: "string" },
              created_at: { type: "string", format: "date-time" },
              expires_at: { type: "string", format: "date-time" },
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
    visitorController.getById.bind(visitorController)
  );

  fastify.put(
    "/:id",
    {
      preHandler: requireAuth,
      schema: {
        tags: ["Visitantes"],
        summary: "Atualizar informações do visitante",
        description: "Atualiza os dados do visitante (apenas pelo morador que o cadastrou)",
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID do visitante" },
          },
        },
        body: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 100,
              description: "Nome completo do visitante",
            },
            vehicle_plate: {
              type: "string",
              description: "Placa do veículo",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              document: { type: "string" },
              vehicle_plate: { type: ["string", "null"] },
              resident_id: { type: "string" },
              resident_name: { type: "string" },
              created_at: { type: "string", format: "date-time" },
              expires_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    visitorController.update.bind(visitorController)
  );
};

export default visitorRoutes;
