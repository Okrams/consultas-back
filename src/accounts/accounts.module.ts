import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccounts } from './entities/user-accounts.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [
    TypeOrmModule.forFeature([UserAccounts]),
    AuthModule
  ]
})
export class AccountsModule {}
