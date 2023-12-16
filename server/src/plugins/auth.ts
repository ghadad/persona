import fp from "fastify-plugin";
import FastifyJwt, { FastifyJwtNamespace } from "@fastify/jwt";
import { FastifyRequest, FastifyReply } from "fastify";
import UserService from "../modules/user/user.service";
import * as basicAuth from "basic-auth";

import LdapService from "../services/ldap";

export interface SupportPluginOptions {
  secret: string;
  cookie?: {
    cookieName: string;
    signed: boolean;
  };
}

declare module "fastify" {
  interface FastifyInstance
    extends FastifyJwtNamespace<{ namespace: "security" }> {}
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): any;
    auth([]: Function[]): any;
  }
}

const bypassPublicRoutes = (request: FastifyRequest) => {
  console.log("request.routerPath", request.routerPath);
  return (
    true ||
    request.routeConfig.auth === false ||
    request.routerPath.match("/docs")
  );
};

const basicAuthMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<boolean | void> => {
  const userService = new UserService();
  const authString = request.headers.authorization;
  if (authString && authString.startsWith("Basic")) {
    const credentials = basicAuth.parse(authString);
    if (!credentials || !credentials.name || !credentials.pass) {
      reply.status(401).send({ error: "Unauthorized" });
    }
    const user = await userService.getUserByUsername(credentials!.name);
    if (user == null) {
      return reply.status(401).send({ error: "User not found" });
    }
    const encryptPassword = userService.encryptPassword(credentials!.pass);
    if (await LdapService.authenticate(credentials!.name, encryptPassword)) {
      request.user = user;

      return true;
    }
    reply.status(401).send({ error: "Unauthorized" });
  }
};

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  await fastify.register(FastifyJwt, {
    secret: "supersecret",
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  fastify.decorate(
    "authenticate",
    async function (request, reply: FastifyReply) {
      // check if route is public and bypass if true
      if (bypassPublicRoutes(request)) {
        request.log.debug("bypassing public routes 2", request.routerPath);
        return;
      }

      //check if basic auth is passed , in this case we don't need to check jwt
      const passBasicAuth = await basicAuthMiddleware(request, reply);
      if (passBasicAuth === true) {
        return;
      }

      // check if jwt is passed
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );

  fastify.addHook("preHandler", fastify.authenticate);

  fastify.addHook("preHandler", async (request, reply) => {
    request.log.debug("user:", request.user);
  });
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    someSupport(): string;
  }
}
