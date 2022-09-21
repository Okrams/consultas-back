import { UserAccounts } from "../../accounts/entities";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    fullName: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('bool', {
        default: false
    })
    termsAndConditions: true;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @Column('text',{
        select: false
    })
    password: string;

    @OneToOne( 
        () => Employee,
        ( user ) => user.user,
    )
    user: Employee;




    @OneToMany(
        () => Employee,
        ( user ) => user.holder,
    )
    workers?: Employee[];


    @OneToMany(
        () => UserAccounts,
        ( userAccount ) => userAccount.user 
    )
    accounts?: UserAccounts[];
    
}
