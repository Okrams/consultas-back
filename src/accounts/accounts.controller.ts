import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from '../user/entities';
import { ValidRoles } from 'src/auth/interfaces';
import { AccountsService } from './accounts.service';
import { AddAccountDto, CreateGroupDto } from './dto';

@Controller('accounts')
export class AccountsController {

  constructor(private readonly accountsService: AccountsService) {}


  @Auth()
  @Get('my-accounts')
  getMyAccounts(
    @GetUser() user: User
  ){
    return this.accountsService.getMyAccounts(user);
  }

  @Auth(ValidRoles.holder)
  @Post('create-group')
  createCustomGroup(
    @GetUser() user: User,
    @Body() createGroupDto: CreateGroupDto
  ){
    return this.accountsService.createCustomGroup(user, createGroupDto);
  }

  // TODO: Verificar
  @Auth( ValidRoles.admin, ValidRoles.holder )
  @Post('update/:id')
  async addAccounts(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Body() addAccountDto: AddAccountDto
  ){
    return await this.accountsService.updateAccounts(id, user, addAccountDto.accounts );
  }

  @Auth()
  @Get('my-groups')
  getMyGroups(
    @GetUser() user: User
  ){
    if(user.roles.includes('admin')){
      return 'All groups of PEMSA'
    }else{
      return `All groups for user ${user.fullName}`;
    }
  }

  
}
