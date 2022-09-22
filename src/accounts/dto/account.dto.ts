import { IsIn, IsString } from "class-validator";

export class AccountDto{
    
    @IsString()
    idAccount: string;

    @IsIn([1,2,3,4],{
        message: "El tipo de cuenta debe ser numerico, solo se aceptan los valores 1, 2, 3, 4"
    })
    typeAccount: number;
}