import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });

  // add health check
  fastify.get(
    "/status",
    { config: { auth: false } },
    async function (request, reply) {
      return { status: "ok" };
    }
  );

  fastify.get(
    "/forbiden",
    { onRequest: fastify.authenticate },
    async function (request, reply) {
      return { root: true };
    }
  );
};

export default root;
