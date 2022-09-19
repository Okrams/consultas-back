import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Uhs } from './entities/other.entity';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Uhs)
    private readonly uhs: Repository<Uhs>

  ){}

  async createHolder (user : any){
    try {
      const user = this.userRepository.create({
        email: 'ed.pe',
        password: '123'
      })
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      
    }
  }


  async createUser(){
    const holder = await this.userRepository.findOneBy({email: 'ed.pe'});
    const usr = this.userRepository.create({
      email: 'ppppppp',
      password: 'ggggr'
    });
    await this.userRepository.save(usr);

    const user = this.uhs.create({
      holder,
      sub: usr
    });
    await this.uhs.save(user);
    return user;
  }

  async myUsers(){
    const user = await this.userRepository.findOne({
      where: {
        email: 'ed.pe'
      },
      relations: {
        holder: true,
        sub: true
      }
    })
    return user;
  }

  async MyHolder (){
    const user = await this.uhs.findOne({
      where: {
        sub: {
          id: '01c8b302-030e-455b-917d-3b96e64cf0c9'
        }
      },
      relations: {
        holder: true,
        sub: true,
      },

    })
    return user;
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
