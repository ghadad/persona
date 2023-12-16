import { DataSource, Repository } from "typeorm";
import { Operator } from "../models/operator.model";
import {
  operatorQueryCriteriaType,
  operatorSchemaType,
} from "../models/operator.schema";
import Container from "typedi";
import RuleService from "./rule.service";

class OperatorService {
  repository: Repository<Operator>;
  conn: DataSource;
  ruleService: RuleService;
  constructor() {
    this.conn = Container.get("connection");
    this.repository = this.conn.getRepository(Operator);
    this.ruleService = new RuleService();
  }

  async getOperators(criteria: operatorQueryCriteriaType) {
    return await this.repository
      .createQueryBuilder("operator")
      .where("title like :term or name like :term or description like :term", {
        term: `%${criteria.term || ""}%`,
      })
      .orderBy(
        "CASE WHEN operator.updatedAt IS NULL THEN '2021-07-04T03:17:55' ELSE operator.updatedAt   END",
        "DESC"
      )
      .addOrderBy("operator.createdAt", "DESC")
      .getMany();
  }

  async getOperatorById(id: number) {
    return await this.repository.findOne({ where: { id: id } });
  }

  async getRules(id: number) {
    return await this.ruleService.getRulesByOperatorId(id);
  }

  async create(operatorObject: operatorSchemaType) {
    const operator = new Operator(operatorObject);
    await this.repository.insert(operator);
    return operator;
  }

  async update(id: number, operator: operatorSchemaType) {
    operator.updatedAt = new Date();
    await this.repository.update({ id: id }, operator as any);
    return this.getOperatorById(id);
  }

  async deleteOperator(id: number) {
    console.log("delete operator", id);
    const result = await this.repository.delete({ id: id });
    console.log("delete operator result", result);
    return { success: true, affected: result.affected };
  }
}

export default OperatorService;
