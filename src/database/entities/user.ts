import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Role } from "./role";
import { Card } from "./card";
import { Comment } from "./comment";
import { Notification } from "./notification";
import { Workspace } from "./workspace";

@Entity()
export class User {
    map(arg0: (user: any) => any): any {
        throw new Error("Method not implemented.");
    }
    @PrimaryGeneratedColumn()
    id?: number
    @Column({length: 100})
    username!: string
    @Column({length: 100})
    email!: string
    @Column({length: 100})
    password!: string
    @Column({length: 100})
    fullname!: string
    @CreateDateColumn()
    created_at?: Date

    @ManyToMany(() => Role, roles => roles.users)
    roles!: Role[]

    @ManyToMany(() => Card, cards => cards.users)
    cards!: Card[]

    @OneToMany(() => Comment, comments => comments.user)
    comments!: Comment[] 

    @OneToMany(() => Notification, notifications => notifications.user)
    notifications!: Notification[]

    @ManyToMany(() => Workspace, workspaces => workspaces.users)
    @JoinTable({ name: 'user_workspace' })
    workspaces!: Workspace[]
    // @ManyToOne(() => Board, board => board.users)
    // boards!: Board[]
}