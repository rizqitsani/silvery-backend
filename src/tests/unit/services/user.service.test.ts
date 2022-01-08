/* eslint-disable @typescript-eslint/no-explicit-any */
import { Repository } from 'typeorm';

import { UserRegisterDto } from '@/interfaces/user';
import User, { UserRole } from '@/models/user.model';
import UserService from '@/services/user.service';

describe('User service', () => {
  test('Create should return user object', async () => {
    const userRepositoryMock = {
      create: (user: any) => {
        return {
          ...user,
          id: 'mock-user-id',
        };
      },
      save: (user: any) => user,
    };

    const userInput: UserRegisterDto = {
      full_name: 'Test',
      telephone: '+628123456789',
      address: 'Kediri',
      email: 'test@mail.com',
      role: UserRole.USER,
      password: 'secret123',
    };

    const userService = new UserService(userRepositoryMock as Repository<User>);
    const user = await userService.createUser(userInput);

    expect(user).toBeDefined;
    expect(user.id).toBeDefined;
  });
});
