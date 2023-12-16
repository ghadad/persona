// create fastify routes for Node module
import { nodeSchemas, $ref } from "./node.schemas";
import type * as nodeTypes from "./node.schemas";
import { FastifyPluginAsync } from "fastify";
import NodeService from "./node.service";
const routes: FastifyPluginAsync = async (server, opts): Promise<void> => {
  const nodeService = new NodeService();
  for (const schema of [...nodeSchemas]) {
    server.addSchema(schema);
  }

  server.get<{ Params: nodeTypes.nodeGetByIdType }>(
    "/flow/:id",
    {
      schema: {
        description: "Get Nodes by Flow Id",
        tags: ["node", "flow"],
        summary: "Get Nodes by Flow Id",
        params: $ref("nodeGetByIdSchema"),
        response: {
          200: $ref("nodesReplySchema"),
        },
      },
    },
    async function (request, reply) {
      const result = await nodeService.getNodesByFlowId(request.params.id);
      return result;
    }
  );

  server.get<{ Params: nodeTypes.nodeGetByIdType }>(
    "/:id",
    {
      schema: {
        description: "Get Node",
        tags: ["node"],
        summary: "Get Node",
        params: $ref("nodeGetByIdSchema"),
        response: {
          200: $ref("nodeReplySchema"),
        },
      },
    },
    async function (request, reply) {
      const node = await nodeService.get(request.params.id);
      if (node) {
        return node;
      } else {
        reply.notFound();
      }
    }
  );

  server.post<{ Body: nodeTypes.nodeSchemaType }>(
    "/",
    {
      schema: {
        description: "Create Node",
        tags: ["node"],
        summary: "Create Node",
        body: $ref("nodeCreateSchema"),
        response: {
          200: $ref("nodeReplySchema"),
        },
      },
    },
    async function (request, reply) {
      return await nodeService.create(request.body);
    }
  );

  server.delete<{ Params: nodeTypes.nodeGetByIdType }>(
    "/:id",
    {
      schema: {
        description: "Delete Node",
        tags: ["node"],
        summary: "Delete Node",
        params: $ref("nodeGetByIdSchema"),
      },
    },
    async function (request, reply) {
      return await nodeService.delete(request.params.id);
    }
  );

  server.put<{
    Body: nodeTypes.nodeSchemaType;
    Params: nodeTypes.nodeGetByIdType;
  }>(
    "/:id",
    {
      schema: {
        description: "Update Node",
        tags: ["node"],
        summary: "Update Node",
        params: $ref("nodeGetByIdSchema"),
        body: $ref("nodeCreateSchema"),
        response: {
          200: $ref("nodeReplySchema"),
        },
      },
    },
    async function (request, reply) {
      return await nodeService.update(request.params.id, request.body);
    }
  );
};

export default routes;
