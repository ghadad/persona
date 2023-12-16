import { DataSource, Repository } from "typeorm";
import { Fact } from "../models/fact.model";
import { factQueryCriteriaType, factSchemaType } from "../models/fact.schema";
import Container from "typedi";
import RuleService from "./rule.service";

class FactService {
  repository: Repository<Fact>;
  conn: DataSource;
  ruleService: RuleService;
  constructor() {
    this.conn = Container.get("connection");
    this.repository = this.conn.getRepository(Fact);
    this.ruleService = new RuleService();
  }

  async getFacts(criteria: factQueryCriteriaType) {
    return await this.repository
      .createQueryBuilder("fact")
      .where("title like :term or name like :term or description like :term", {
        term: `%${criteria.term || ""}%`,
      })
      .orderBy(
        "CASE WHEN fact.updatedAt IS NULL THEN '2021-07-04T03:17:55' ELSE fact.updatedAt   END",
        "DESC"
      )
      .addOrderBy("fact.createdAt", "DESC")
      .getMany();
  }

  async getFactById(id: number) {
    return await this.repository.findOne({ where: { id: id } });
  }

  async getRules(id: number) {
    return await this.ruleService.getRulesByFactId(id);
  }

  async create(factObject: factSchemaType) {
    const fact = new Fact(factObject);
    await this.repository.insert(fact);
    return fact;
  }

  async update(id: number, fact: factSchemaType) {
    fact.updatedAt = new Date();
    await this.repository.update({ id: id }, fact as any);
    return this.getFactById(id);
  }

  async deleteFact(id: number) {
    console.log("delete fact", id);
    const result = await this.repository.delete({ id: id });
    console.log("delete fact result", result);
    return { success: true, affected: result.affected };
  }
}

export default FactService;
