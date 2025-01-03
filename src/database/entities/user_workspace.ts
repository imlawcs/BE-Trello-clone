import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Workspace } from "./workspace";
import { User } from "./user";
import { Role } from "./role";

@Entity('user_workspace')
export class UserWorkspace {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(() => Workspace)
    @JoinColumn({ name: 'workspaceId' })
    workspace!: Workspace;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'roleId' })
    role!: Role
}