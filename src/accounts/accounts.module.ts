import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccounts } from './entities/user-accounts.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CustomGroup, GroupAccount } from './entities';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [
    TypeOrmModule.forFeature([UserAccounts, CustomGroup, GroupAccount]),
    AuthModule,
    UserModule
  ]
})
export class AccountsModule {}
