import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";
import { accessSchemaType } from "./access.schema";

@Entity("yp_access")
export class Access {
  constructor(accessObject: accessSchemaType) {
    Object.assign(this, accessObject);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  @Column({ length: 50 })
  username: string;

  @Column({ type: "text", nullable: true })
  role: string;

  @Column({ type: "text", nullable: true })
  readonly: string;

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
