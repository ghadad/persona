import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

import { FastifyPluginAsync } from "fastify";

const myPluginAsync: FastifyPluginAsync = async (fastify, options) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "SYS  API",
        description: "Swagger REST API",
        version: "1",
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
      // servers: [{ url: "http://localhost:3000" }],
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    initOAuth: {},
    uiConfig: {
      docExpansion: "none",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
};
export default fp(myPluginAsync);
