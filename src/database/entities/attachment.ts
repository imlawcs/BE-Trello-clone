import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Card } from "./card";

@Entity()
export class Attachment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    url!: string;

    @Column()
    name?: string;

    @ManyToOne(() => Card, card => card.attachments)
    card!: Card;
}