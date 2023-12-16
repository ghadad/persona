// create NodeService class and export initiation of NodeService class

import { nodeSchemaType } from "./node.schemas";
import { Node } from "./node.model";
import { Repository } from "typeorm";
import { Container } from "typedi";
import { DataSource } from "typeorm";

class NodeService {
  private repository: Repository<Node>;
  private db: DataSource;
  constructor() {
    this.db = Container.get("connection");
    this.repository = this.db.getRepository(Node);
  }

  async get(id: number) {
    const node = await this.repository.findOne({ where: { id: id } });
    return node;
  }

  async getNodesByFlowId(id: number) {
    const nodes = await this.repository.find({ where: { flowId: id } });
    return nodes;
  }

  async create(node: nodeSchemaType) {
    const newNode = new Node(node);
    await this.repository.insert(newNode);
    return newNode;
  }

  async update(id: number, node: nodeSchemaType) {
    await this.repository.update({ id: id }, node);
    return await this.get(id);
  }

  async delete(id: number) {
    const result = await this.repository.delete(id);
    return { success: true, affected: result.affected };
  }

  //demonstration of using raw query
  async getNodes() {
    const nodes = await this.db.query(`SELECT * FROM node`);
    return nodes;
  }
}

export default NodeService;
