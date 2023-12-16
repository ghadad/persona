import { DataSource, Repository } from "typeorm";
import { Access } from "../models/access.model";
import {
  accessQueryCriteriaType,
  accessSchemaType,
} from "../models/access.schema";
import Container from "typedi";
import RuleService from "./rule.service";

class AccessService {
  repository: Repository<Access>;
  conn: DataSource;
  ruleService: RuleService;
  constructor() {
    this.conn = Container.get("connection");
    this.repository = this.conn.getRepository(Access);
    this.ruleService = new RuleService();
  }

  async getAccesss(criteria: accessQueryCriteriaType) {
    return await this.repository
      .createQueryBuilder("access")
      .where("title like :term or name like :term or description like :term", {
        term: `%${criteria.term || ""}%`,
      })
      .orderBy(
        "CASE WHEN access.updatedAt IS NULL THEN '2021-07-04T03:17:55' ELSE access.updatedAt   END",
        "DESC"
      )
      .addOrderBy("access.createdAt", "DESC")
      .getMany();
  }

  async getAccessById(id: number) {
    return await this.repository.findOne({ where: { id: id } });
  }

  async getRules(id: number) {
    return await this.ruleService.getRulesByAccessId(id);
  }

  async create(accessObject: accessSchemaType) {
    const access = new Access(accessObject);
    await this.repository.insert(access);
    return access;
  }

  async update(id: number, access: accessSchemaType) {
    access.updatedAt = new Date();
    await this.repository.update({ id: id }, access as any);
    return this.getAccessById(id);
  }

  async deleteAccess(id: number) {
    console.log("delete access", id);
    const result = await this.repository.delete({ id: id });
    console.log("delete access result", result);
    return { success: true, affected: result.affected };
  }
}

export default AccessService;
