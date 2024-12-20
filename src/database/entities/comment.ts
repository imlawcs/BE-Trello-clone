import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { Card } from "./card";
import { User } from "./user";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  comment!: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @ManyToOne(() => Card, (card) => card.comments)
  card!: Card;

  @ManyToOne(() => User, (user) => user.comments)
  user!: User;
}