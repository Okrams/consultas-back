import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee, User } from './entities';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    forwardRef( () => AuthModule),
    TypeOrmModule.forFeature([User, Employee]),
  ],
  exports: [TypeOrmModule, UserService]
})
export class UserModule {}
