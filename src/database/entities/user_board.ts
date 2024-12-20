import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Board } from "./board";
import { User } from "./user";
import { Role } from "./role";

@Entity('user_board')
export class UserBoard {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(() => Board)
    @JoinColumn({ name: 'boardId' })
    Board!: Board;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'roleId' })
    Role!: Role
}