import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { flowSchemaType } from "./flow.schema";

@Entity()
export class Flow {
  constructor(flowObject: flowSchemaType) {
    Object.assign(this, flowObject);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 400 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ length: 300, nullable: true })
  tags: string;

  @Column({
    name: "createdAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "updfaetdAt",
    type: "timestamp",
    nullable: true,
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
