import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
//
@Entity()
export class Node {
  constructor(nodeObject: any) {
    Object.assign(this, nodeObject);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, type: "varchar", default: "node" })
  type: string;

  // foreign key for flow
  @Column({
    type: "bigint",
    name: "flowId",
    unsigned: true,
    foreignKeyConstraintName: "fk_node_flow_id",
    default: 0,
  })
  flowId: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, nullable: true })
  title: string;

  @Column("text")
  description: string;

  @Column("int", { unsigned: true, default: 0 })
  position: number;

  @Column({ type: "varchar", length: 15, nullable: true })
  actionType: string;

  @Column({ type: "text", nullable: true })
  action: string;

  @Column({ type: "text", nullable: true })
  postAction: string;

  @Column({ type: "text", nullable: true })
  columns: string;

  @Column({ type: "text", nullable: true })
  inputSchema: string;

  @Column({ type: "text", nullable: true })
  outputSchema: string;

  @Column("date", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column("date", { nullable: true })
  updatedAt: Date;
}
