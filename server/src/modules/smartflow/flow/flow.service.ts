import { DataSource, Repository } from "typeorm";
import { Flow } from "./flow.model";
import { flowQueryCriteriaType, flowSchemaType } from "./flow.schema";
import Container from "typedi";
import NodeService from "../node/node.service";

class FlowService {
  repository: Repository<Flow>;
  conn: DataSource;
  nodeService: NodeService;
  constructor() {
    this.conn = Container.get("connection");
    this.repository = this.conn.getRepository(Flow);
    this.nodeService = new NodeService();
  }

  async getFlows(criteria: flowQueryCriteriaType) {
    return await this.repository
      .createQueryBuilder("flow")
      .where("title like :term or name like :term or description like :term", {
        term: `%${criteria.term || ""}%`,
      })
      .orderBy(
        "CASE WHEN flow.updatedAt IS NULL THEN '2021-07-04T03:17:55' ELSE flow.updatedAt   END",
        "DESC"
      )
      .addOrderBy("flow.createdAt", "DESC")
      .getMany();
  }

  async getFlowById(id: number) {
    return await this.repository.findOne({ where: { id: id } });
  }

  async getNodes(id: number) {
    return await this.nodeService.getNodesByFlowId(id);
  }

  async create(flowObject: flowSchemaType) {
    const flow = new Flow(flowObject);
    await this.repository.insert(flow);
    return flow;
  }

  async update(id: number, flow: flowSchemaType) {
    flow.updatedAt = new Date();
    await this.repository.update({ id: id }, flow as any);
    return this.getFlowById(id);
  }

  async deleteFlow(id: number) {
    console.log("delete flow", id);
    const result = await this.repository.delete({ id: id });
    console.log("delete flow result", result);
    return { success: true, affected: result.affected };
  }
}

export default FlowService;
