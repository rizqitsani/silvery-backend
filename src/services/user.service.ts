import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { UserRegisterDto } from '@/interfaces/user';
import User from '@/models/user.model';

@Service()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userRegisterDto: UserRegisterDto) {
    const user = this.userRepository.create({
      full_name: userRegisterDto.full_name,
      telephone: userRegisterDto.telephone,
      address: userRegisterDto.address,
      email: userRegisterDto.email,
      role: userRegisterDto.role,
      password: userRegisterDto.password,
    });

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async getCount() {
    const count = await this.userRepository.count();
    return count;
  }
}
