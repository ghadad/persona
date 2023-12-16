import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ruleSchemaType } from "./rule.schema";

@Entity("yp_rule")
export class Rule {
  constructor(ruleObject: ruleSchemaType) {
    Object.assign(this, ruleObject);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 400 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  factId: number;

  @Column({ type: "text", nullable: true })
  rule: string;

  @Column()
  priority: number;

  @Column()
  priority2: number;

  @Column({ length: 300, nullable: true })
  tags: string;

  @Column({ length: 300, nullable: true })
  groups: string;

  @Column({
    name: "startAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  startAt: Date;

  @Column({
    name: "endAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  endAt: Date;

  @Column()
  createdBy: string;

  @Column({
    name: "createdAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "updatedAt",
    type: "timestamp",
    nullable: true,
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
