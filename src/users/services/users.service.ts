import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Users } from '../entity/Users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async findOne(name: string): Promise<Users> {
    return await this.usersRepository.findOne({ where: { name } });
  }

  async createOne({ name, password }: Users): Promise<Users> {
    return await this.usersRepository.save({
      name,
      password,
    });
  }
}
