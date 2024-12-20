import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn("increment")
    id?: number;
    
    @Column()
    title!: string;
    
    @Column()
    description?: string;

    @Column()
    createdAt!: Date;

    @Column()
    isRead!: boolean;
    
    @ManyToOne(() => User, (user) => user.notifications)
    user!: User;
}