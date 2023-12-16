import { FastifyInstance } from "fastify";
import { $ref } from "./product.schema";

async function productRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createProductSchema"),
        response: {
          201: $ref("productReplySchema"),
        },
      },
    },
    (request, reply) => {
      return {};
    }
  );

  server.get(
    "/",
    {
      schema: {
        response: {
          200: $ref("productsReplySchema"),
        },
      },
    },
    (request, reply) => {
      return {};
    }
  );
}

export default productRoutes;
