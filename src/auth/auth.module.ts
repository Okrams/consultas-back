import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Uhs } from './entities/other.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Uhs])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
