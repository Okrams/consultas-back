import { IsArray, IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @MinLength(10)
    fullName: string;

    @IsEmail()
    email: string;

    @IsArray()
    roles: string[];

}
