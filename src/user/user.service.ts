import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Employee, User } from './entities';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto';
@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly dataSource: DataSource,

  ) { }

  // TODO Para filtrar por rol
  // const users = await this.userRepository.createQueryBuilder('users')
  //   .where('users.roles @> :roles', { roles: ['holder'] })
  //   .getMany()
  // TODO Para obtener las relaciones
  //   where: {id},
  //   relations: {
  //     user:{
  //       holder: true
  //     },
  //     workers:{
  //       user: true
  //     }
  //   }
  // }

  async findUser(options: FindOneOptions<User>,) {
    return await this.userRepository.findOne(options);
  }

  async createUserWithRole(user: CreateUserDto) {
    const { email, fullName, roles } = user;
    const password = this.generatePassword();
    // TODO Enviar password por correo al usuario registrado
    try {
      const user = this.userRepository.create({
        email,
        fullName,
        roles,
        password: bcrypt.hashSync('1234', 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async createUser(createUserDto: CreateUserDto, user: User) {
    const { email, fullName } = createUserDto;
    const password = this.generatePassword();
    // TODO Enviar password al correo
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const newUser = this.userRepository.create({
        email,
        fullName,
        password: bcrypt.hashSync('1234', 10)
      });

      const response = await queryRunner.manager.save(newUser);
      const relationUser = this.employeeRepository.create({
        holder: user,
        user: newUser
      });

      await queryRunner.manager.save(relationUser);

      await queryRunner.commitTransaction();
      delete response.password;
      return response;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBError(error);
    }
    finally {
      await queryRunner.release();
    }
  }

  async getAlluser() {
    try {
      const users = await this.userRepository.find({});

      return users;

    } catch (error) {
      this.handleDBError(error);
    }
  }

  async getMyUsers(user: User) {
    try {
      const users = await this.userRepository.find({
        where: { id: user.id },
        relations: {
          workers: {
            user: true
          }
        }
      });
      return users;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async getMyHolder(user: User){
    try {
      const users = await this.userRepository.find({
        where: { id: user.id },
        relations: {
          user: {
            holder: true
          }
        }
      });
      return users;
    } catch (error) {
      this.handleDBError(error);
    }
  }


  private generatePassword() {
    const lower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const upper = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const specialCharacters = ['!', '*', '(', ')', '#', '$', '%', '&', '=', '?', '¿'];
    let password = '';
    let index = 0;
    for (let i = 0; i <= 8; i++) {
      const group = Math.floor(Math.random() * 5);
      switch (group) {
        case 1:
          index = Math.floor(Math.random() * (lower.length - 1));
          password = password + lower[index];
          break;
        case 2:
          index = Math.floor(Math.random() * (upper.length - 1));
          password = password + upper[index];
          break;
        case 3:
          index = Math.floor(Math.random() * (numbers.length - 1));
          password = password + numbers[index];
          break;
        case 4:
          index = Math.floor(Math.random() * (specialCharacters.length - 1));
          password = password + specialCharacters[index];
          break;
      }
    }
    return password;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Please check server logs');
  }

}
