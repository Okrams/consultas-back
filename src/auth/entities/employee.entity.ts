import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Employee {
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(
        () => User,
        ( user ) => user.users,
    )
    holder: User;

    @OneToOne(
        () => User,
    )
    @JoinColumn()
    employee: User;

}