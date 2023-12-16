import { DataSource } from "typeorm";

declare module "fastify" {
  // add services to fastify instance
  interface FastifyInstance {
    db: DataSource;
    services: any;
  }
}
