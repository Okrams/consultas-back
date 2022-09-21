import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from '../user/entities';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginUserDto: LoginUserDto){
    return await this.authService.login(loginUserDto);
  }

  @Auth()
  @Get('check-auth')
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user);
  }
  
}
