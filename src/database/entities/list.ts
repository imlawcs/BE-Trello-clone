import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Card } from "./card";
import { Board } from "./board";

@Entity()
export class List {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @OneToMany(() => Card, cards => cards.list)
    cards!: Card[];

    @ManyToOne(() => Board, board => board.lists)
    board!: Board;
}