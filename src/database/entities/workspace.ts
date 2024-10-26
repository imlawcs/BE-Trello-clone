import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Board } from "./board";
import { User } from "./user";

@Entity()
export class Workspace {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    title!: string;
    
    @Column()
    description?: string;
    
    @ManyToMany(() => User, (users) => users.workspaces)
    users!: User;
    
    @OneToMany(() => Board, (boards) => boards.workspace)
    boards!: Board[];
    }
