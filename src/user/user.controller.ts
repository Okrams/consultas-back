import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from './entities';
import { ValidRoles } from '../auth/interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Auth(ValidRoles.admin, ValidRoles.holder)
  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: User
  ){
    if(createUserDto.roles && !user.roles.includes('admin')){
      throw new UnauthorizedException('No tiene los accesos necesarios para esta acción');
    }
    if(user.roles.includes('admin') && !createUserDto.roles){
      createUserDto.roles = ['user'];
    }
    if(user.roles.includes('admin') && !createUserDto.roles.includes('user')){
      return await this.userService.createUserWithRole(createUserDto);
    }else{
      return await this.userService.createUser(createUserDto, user);
    }
  }

  @Auth(ValidRoles.admin)
  @Get()
  async findAll() {
    return await this.userService.getAlluser();
  }

  @Auth(ValidRoles.holder)
  @Get('my-users')
  async findMyUsers(
    @GetUser() user: User
  ){
    return await this.userService.getMyUsers(user);
  }

  @Auth(ValidRoles.user)
  @Get('my-holder')
  async findMyHolder(@GetUser() user: User){
    return await this.userService.getMyHolder(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findUser({where: {id}});
  }

 
}
