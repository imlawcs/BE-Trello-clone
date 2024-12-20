import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Card } from "./card";

@Entity()
export class Checklist {
    @PrimaryGeneratedColumn("increment")
    id?: number;

    @Column()
    title!: string;

    @Column()
    dueDate?: Date;

    @Column()
    isDone!: boolean;

    @ManyToOne(() => Card, (card) => card.checklists)
    card!: Card;
}