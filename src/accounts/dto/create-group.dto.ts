import { IsString } from "class-validator";

export class CreateGroupDto{
    @IsString()
    name: string;

    @IsString({
        message: "Las cuentas adjuntas son obligatorias",
        each: true
    })
    accounts: string[];
}