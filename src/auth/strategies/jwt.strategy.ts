import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../user/entities";
import { UserService } from "src/user/user.service";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly userService: UserService,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        if(!id){
            throw new UnauthorizedException('Token no valido');
        }
        const user = await this.userService.findUser({
            where: {id}
        });

        if(!user) throw new UnauthorizedException('Token no valido');

        if(!user.isActive) throw new UnauthorizedException('Usuario inactivo, hable con un administrador');
        delete user.password;
        return user;
    }

}