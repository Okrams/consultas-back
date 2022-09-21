import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }


  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userService.findUser({
      where: {email},
      select: {
        email: true, fullName: true, termsAndConditions: true, roles: true, password: true, id: true
      }
    });

    if (!user) throw new UnauthorizedException('Credenciales no validas');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credenciales no validas');
    delete user.password;
    return {
      ...user, token: this.getJwt({ id: user.id })
    }
  }
  
  async checkAuthStatus(user: User) {
    delete user.isActive;
    return { ...user, token: this.getJwt({ id: user.id }) };
  }
  
  private getJwt(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);

    return token;
  }


}
