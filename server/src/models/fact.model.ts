import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { factSchemaType } from "./fact.schema";

@Entity("yp_fact")
export class Fact {
  constructor(factObject: factSchemaType) {
    Object.assign(this, factObject);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 400 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  schema: string;

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
