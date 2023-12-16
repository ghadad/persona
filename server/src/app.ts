import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import { productSchemas } from "./modules/product/product.schema";
import createOrGetConnection from "./db";

import "reflect-metadata";

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  await createOrGetConnection();
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application

  for (const schema of [...productSchemas]) {
    fastify.addSchema(schema);
  }

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "modules"),
    maxDepth: 6,
    matchFilter: (path) => {
      return path.includes(".route.");
    },
    options: { prefix: "/m" },
  });
};

export default app;
export { app, options };
