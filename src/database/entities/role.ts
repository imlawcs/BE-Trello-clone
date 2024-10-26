import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Permission } from "./permission";
import { User } from "./user";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id!: number
    @Column({length: 100})
    name!: string

    @ManyToMany(() => Permission, permissions => permissions.roles)
    permissions!: Permission[]

    @ManyToMany(() => User, users => users.roles)
    @JoinTable({ name: 'user_role' })
    users!: User[]
}
