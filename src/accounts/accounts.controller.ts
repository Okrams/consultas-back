import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from '../user/entities';
import { ValidRoles } from 'src/auth/interfaces';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}


  @Auth()
  @Get('my-accounts')
  getMyAccounts(
    @GetUser() user: User
  ){
    if(user.roles.includes('admin')){
      return 'All accounts of PEMSA'
    }else{
      return `All accounts for user ${user.fullName}`;
    }
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

  @Auth( ValidRoles.admin, ValidRoles.holder )
  @Post('add-accounts/:id')
  addAccounts(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ){
    return this.accountsService.addAccounts(id, user);
  }

  

  
}
