import { IsArray, IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString({
        message: 'El nombre debe ser de tipo texto'
    })
    @MinLength(10, {
        message: 'El nombre debe de tener al menos 10 caracteres'
    })
    fullName: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsArray({
        message: 'El campo roles debe ser de tipo arreglo'
    })
    roles: string[];

}
