import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from "typeorm";
import { User } from "./user";
import { List } from "./list";
import { Workspace } from "./workspace";
import { ActivityLog } from "./activitylog";

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description?: string;

  @ManyToMany(() => User, (users) => users.boards)
  users!: User[];

  @OneToMany(() => List, (lists) => lists.board)
  lists!: List[];

  @ManyToOne(() => Workspace, (workspace) => workspace.boards)
  workspace!: Workspace;

  @OneToMany(() => ActivityLog, (activityLogs) => activityLogs.board)
  activityLogs!: ActivityLog[];
}