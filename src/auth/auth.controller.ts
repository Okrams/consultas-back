import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { CreateUserDto, CreateUserWithOuthRole, LoginUserDto } from './dto';
import { User } from './entities';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Auth( ValidRoles.admin )
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto){
    return createUserDto;
  }

  @Auth( ValidRoles.holder )
  @Post('register-user')
  async registerUser(
    @Body() createUserDto: CreateUserWithOuthRole,
    @GetUser() user: User
  ){
    return this.authService.createUser(createUserDto, user);
  }


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
