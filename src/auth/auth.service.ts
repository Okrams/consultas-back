import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto, CreateUserWithOuthRole, LoginUserDto } from './dto';
import { User, Employee } from './entities';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,


  ) { }


  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });

    if (!user) throw new UnauthorizedException('Credenciales no validas');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credenciales no validas');

    return {
      ...user, token: this.getJwt({ id: user.id })
    }
  }


  private getJwt(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);

    return token;
  }

  // * OK

  async createUserWithRole(user: CreateUserDto) {
    const { email, fullName, roles } = user;
    // TODO Generar password aleatorio
    try {
      const user = this.userRepository.create({
        email,
        fullName,
        roles,
        password: bcrypt.hashSync('1234', 10)
      });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      return {
        error
      }
    }
  }

  async createUser(createUserDto: CreateUserWithOuthRole, user: User) {
    const { email, fullName } = createUserDto;
    // TODO Generar password aleatorio
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
      const a = this.employeeRepository.create({
        holder: user,
        employee: newUser
      });
      
      await queryRunner.manager.save(a);

      await queryRunner.commitTransaction();

      return response;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        error
      }
    }
    finally{
      await queryRunner.release();
    }
  }

  async checkAuthStatus(user:User){
    return { ...user, token: this.getJwt({ id: user.id }) };
  }

  async myUsers() {
    const user = await this.userRepository.findOne({
      where: {
        email: 'ed.pe.r@hotmail.com'
      },
      relations: {
        users: {
          employee: true,
        }
      }
    })

    return user;
  }

  async MyHolder() {
    // const user = await this.employeeRepository.findOne({
    //   where: {
    //     employee: {
    //       id: 'e6f2ad1e-ea89-40d1-bcd4-239e88e89bc0'
    //     }
    //   },
    //   relations: {
    //     holder: true,
    //     employee: true,
    //   },

    // })
    const user = await this.userRepository.findOne({
      where: {
        email: 'aaa12'
      },
      relations: {
        users: {
          holder: {
            users: true
          },
          employee: {
            users: true
          },
        }
      }
    })
    return user;
  }


}
