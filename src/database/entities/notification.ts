import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    title!: string;
    
    @Column()
    description?: string;
    
    @ManyToOne(() => User, (user) => user.notifications)
    user!: User;
    }