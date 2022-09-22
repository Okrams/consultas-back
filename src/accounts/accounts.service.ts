import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { User } from '../user/entities';
import { accounts } from './db/data';
import { AccountDto, CreateGroupDto } from './dto';
import { CustomGroup, GroupAccount, UserAccounts } from './entities';

@Injectable()
export class AccountsService {

  constructor(
    @InjectRepository(UserAccounts)
    private readonly userAccountsRepository: Repository<UserAccounts>,
    @InjectRepository(CustomGroup)
    private readonly groupRepository: Repository<CustomGroup>,
    @InjectRepository(GroupAccount)
    private readonly groupAccountsRepository: Repository<GroupAccount>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,


  ) { }

  // TODO Verificar return
  async createCustomGroup(user: User, createGroupDto: CreateGroupDto){
    const accountsHolder = await this.myAccounts({
      where: {
        user:{
          id: user.id
        },
        typeAccount: 1,
      }
    });
    const isCoorect = createGroupDto.accounts.every(acc => accountsHolder.find(ach => ach.idAccount === acc));
    if(!isCoorect) throw new BadRequestException('Algunas cuentas no pertenecen al dealer'); 

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newGroup = this.groupRepository.create({
        name: createGroupDto.name,
        user,
        accounts: createGroupDto.accounts.map( account => this.groupAccountsRepository.create({ idAccount: account}))
      });
      await queryRunner.manager.save(newGroup);

      const assigGroup = this.userAccountsRepository.create({
        user,
        idAccount: newGroup.idGroup.toString(),
        typeAccount: 4
      });

      await queryRunner.manager.save(assigGroup);

      await queryRunner.commitTransaction();
      
      return newGroup;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return this.handleDBError(error);
    }finally{
      await queryRunner.release();
    }
  }

  // TODO Add fetch to service in two case
  async getMyAccounts(user: User) {
    const acc = accounts;
    if (user.roles.includes('admin')) {
      // TODO Peticion para obtener todas las cuentas
      return acc;
    } else {
      const accounts = await this.myAccounts({
        where:{
          user: {
            id: user.id
          }
        }
      });
      return accounts;
      return accounts.map(account => {
        return acc.find(act => act.idAccount === account.idAccount)
      })
    }
  }

  // TODO Verificar uso
  async updateAccounts(idUser: string, user: User, accounts: AccountDto[]) {

    // const userToAdd = await this.userService.findUser({ where: { id: idUser }, relations: { accounts: true } });
    // if (!userToAdd) throw 'Usuario no existente';

    // const accountToDelete = userToAdd.accounts.filter(account => !accounts.find(acc => acc.typeAccount === account.typeAccount && acc.idAccount === account.idAccount)).map(acc => acc.id);
    // const accountsToAdd: AccountDto[] = accounts.filter(account => !userToAdd.accounts.find(acc => acc.typeAccount === account.typeAccount && acc.idAccount === account.idAccount));

    // if (user.roles.includes('admin')) {
    //   await this.updateMyAccounts(accountToDelete, accountsToAdd, userToAdd);
    // } else {
    //   const accountsHolder = await this.myAccounts(user);
    //   const isCoorect = accounts.every(acc => accountsHolder.find(ach => ach.idAccount === acc.idAccount));
    //   if (!isCoorect) {
    //     throw new BadRequestException('Alguna de las cuentas no pertenecen al dealer');
    //   }
    //   await this.updateMyAccounts(accountToDelete, accountsToAdd, userToAdd);
    // }

    return {
      msg: 'Contactos actualizados'
    }


  }
  // TODO Verificar uso
  private async updateMyAccounts(accountsDelete: number[], accountsAdd: AccountDto[], user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (accountsDelete.length > 0) {
        await queryRunner.manager.delete(UserAccounts, accountsDelete);
      }
      if (accountsAdd.length > 0) {
        const accoutsSave = accountsAdd.map(acAd => this.userAccountsRepository.create({ idAccount: acAd.idAccount, typeAccount: acAd.typeAccount, user: user }));
        await queryRunner.manager.save(accoutsSave);
      }

      await queryRunner.commitTransaction();

    } catch (error) {
      await queryRunner.rollbackTransaction();
      return this.handleDBError(error);
    } finally {
      await queryRunner.release();
    }
  }



  private async myAccounts(options: FindManyOptions<UserAccounts>) {
    try {
      return await this.userAccountsRepository.find(options);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Please check server logs');
  }
}
