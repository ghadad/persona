// create RuleService class and export initiation of RuleService class

import { ruleSchemaType } from "../models/rule.schema";
import { Rule } from "../models/rule.model";
import { Repository } from "typeorm";
import { Container } from "typedi";
import { DataSource } from "typeorm";

class RuleService {
  private repository: Repository<Rule>;
  private db: DataSource;
  constructor() {
    this.db = Container.get("connection");
    this.repository = this.db.getRepository(Rule);
  }

  async get(id: number) {
    const rule = await this.repository.findOne({ where: { id: id } });
    return rule;
  }

  async getRulesByFlowId(id: number) {
    const rules = await this.repository.find({ where: { ruleId: id } });
    return rules;
  }

  async create(rule: ruleSchemaType) {
    const newRule = new Rule(rule);
    await this.repository.insert(newRule);
    return newRule;
  }

  async update(id: number, rule: ruleSchemaType) {
    await this.repository.update({ id: id }, rule);
    return await this.get(id);
  }

  async delete(id: number) {
    const result = await this.repository.delete(id);
    return { success: true, affected: result.affected };
  }

  //demonstration of using raw query
  async getRules() {
    const rules = await this.db.query(`SELECT * FROM rule`);
    return rules;
  }
}

export default RuleService;
