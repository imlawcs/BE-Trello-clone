import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user";
import { Board } from "./board";
import { Card } from "./card";
import e from "express";

@Entity()
export class ActivityLog {
    @PrimaryGeneratedColumn("increment")
    id?: number;

    @Column()
    action!: string;

    // @Column()
    // entity!: string;

    // @Column()
    // entityId!: number;

    @Column()
    description?: string;

    @CreateDateColumn()
    date?: Date;

    @ManyToOne(() => User, user => user.activityLogs)
    user!: User;

    @ManyToOne(() => Board, board => board.activityLogs)
    board!: Board;

    @ManyToOne(() => Card, card => card.activityLogs)
    card?: Card;
}