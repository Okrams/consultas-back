import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Employee {
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(
        () => User,
        ( user ) => user.workers
    )
    holder: User;


    @OneToOne(
        () => User,
        ( user ) => user.user
    )
    @JoinColumn()
    user: User;

}