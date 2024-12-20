import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Role } from "./role";
import { Card } from "./card";
import { Comment } from "./comment";
import { Notification } from "./notification";
import { Workspace } from "./workspace";
import { ActivityLog } from "./activitylog";
import { Board } from "./board";

@Entity()
export class User {
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
    @JoinTable({
        name: "user_workspace", // Đặt tên bảng trung gian là 'user_workspace'
        joinColumn: {
            name: "userId", // Cột liên kết với bảng 'user'
            referencedColumnName: "id", // Cột 'id' trong bảng 'user'
        },
        inverseJoinColumn: {
            name: "workspaceId", // Cột liên kết với bảng 'workspace'
            referencedColumnName: "id", // Cột 'id' trong bảng 'workspace'
        },
    })
    workspaces!: Workspace[]

    @ManyToMany(() => Board, board => board.users)
    @JoinTable({
        name: "user_board", // Đặt tên bảng trung gian là 'user_board'
        joinColumn: {
            name: "userId", // Cột liên kết với bảng 'user'
            referencedColumnName: "id", // Cột 'id' trong bảng 'user'
        },
        inverseJoinColumn: {
            name: "boardId", // Cột liên kết với bảng 'board'
            referencedColumnName: "id", // Cột 'id' trong bảng 'board'
        },
    })
    boards!: Board[];
    
    @OneToMany(() => ActivityLog, activityLogs => activityLogs.user)
    activityLogs!: ActivityLog[]
}