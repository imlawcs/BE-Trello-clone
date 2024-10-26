import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user";
import { Attachment } from "./attachment";
import { Comment } from "./comment";
import { List } from "./list";

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description?: string;

  @OneToMany(() => Attachment, (attachments) => attachments.card)
  attachments!: Attachment[];

  @ManyToMany(() => User, (user) => user.cards)
  @JoinTable({ name: 'user_card' })
  users!: User;

  @OneToMany(() => Comment, (comments) => comments.card)
  comments!: Comment[];

  @ManyToOne(() => List, (list) => list.cards)
  list!: List;
}