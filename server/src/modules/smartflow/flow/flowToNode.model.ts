import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class FlowToNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  position: number;

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
