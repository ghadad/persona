import { DataSource } from "typeorm";
import { User } from "./modules/user/user.model";
import { Rule } from "./models/rule.model";
import { Fact } from "./models/fact.model";
import { Operator } from "./models/operator.model";
import { Access } from "./models/access.model";

import { Node } from "./modules/smartflow/node/node.model";
import { Flow } from "./modules/smartflow/flow/flow.model";
import { Container } from "typedi";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "postgres",
  password: "postgres",
  database: "yes_persona",
  port: 5432,
  entities: [User, Rule, Fact, Operator, Access, Node, Flow],
  synchronize: true, // on production set to false
});

let connection: DataSource;

const createOrGetConnection = async () => {
  if (!connection) {
    connection = await AppDataSource.initialize();
    await Container.set("connection", connection);
  }
  return connection;
};

export default createOrGetConnection;
