import { DataSource } from "typeorm";
import { FastifyRequest, FastifyContextConfig } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    db: DataSource;
    services: any;
  }

  interface FastifyContextConfig {
    auth?: boolean;
  }
}
