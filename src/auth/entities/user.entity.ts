import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Uhs } from "./other.entity";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text')
    password: string;

    @OneToMany(
        () => Uhs,
        ( user ) => user.holder
    )
    holder: Uhs;

    @OneToMany(
        () => Uhs,
        ( user ) => user.sub
    )
    sub: Uhs;
    
}
