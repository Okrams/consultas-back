import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('uhs')
export class Uhs{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(
        () => User,
        ( user ) => user.holder,
        {eager: true}
    )
    holder: User;

    @ManyToOne(
        () => User,
        ( user ) => user.sub,
        {eager: true}
    )
    sub: User;
}