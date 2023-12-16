import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";
import { operatorSchemaType } from "./operator.schema";

@Entity("yp_operator")
export class Operator {
  constructor(operatorObject: operatorSchemaType) {
    Object.assign(this, operatorObject);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ length: 50 })
  name: string;

  @Column({ length: 400 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ length: 10, nullable: true })
  type: string;

  @Column({ type: "text", nullable: true })
  code: string;

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
