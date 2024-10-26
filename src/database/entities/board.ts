import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user";
import { List } from "./list";
import { Workspace } from "./workspace";

@Entity() 
export class Board {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description?: string;

  // @ManyToOne(() => User, (user) => user.boards)
  // users!: User;

  @OneToMany(() => List, (lists) => lists.board)
  lists!: List[];

  @ManyToOne(() => Workspace, (workspace) => workspace.boards)
  workspace!: Workspace;
}