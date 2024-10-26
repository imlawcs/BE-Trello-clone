import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Role } from "./role";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id!: number
    @Column({length: 100})
    name!: string

    @ManyToMany(() => Role, roles => roles.permissions)
    @JoinTable({ name: 'role_permission' })
    roles!: Role[]
}