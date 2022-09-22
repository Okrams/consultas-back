import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { AccountDto } from "./account.dto";

export class AddAccountDto{

    @IsArray({
        message: "Las cuentas adjuntas son obligatorias"
    })
    @ValidateNested({each: true})
    @Type(() => AccountDto)
    accounts: AccountDto[];
}