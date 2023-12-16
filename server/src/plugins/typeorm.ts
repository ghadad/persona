import fp from "fastify-plugin";
import createOrGetConnection from "../db";
import { FastifyPluginAsync } from "fastify";

const myPluginAsync: FastifyPluginAsync = async (fastify, options) => {
  const connection = await createOrGetConnection();
  //  add the connection to onRequet Hook   so that we can access it in our routes
  fastify.addHook("onRequest", async (req, done) => {
    req.db = connection;
  });

  fastify.get("/plugin", async (_request, reply) => {
    const result = await connection.manager.query("select * from user");
    reply.send({ msg: "hello plugin", result });
  });
};
export default fp(myPluginAsync);
