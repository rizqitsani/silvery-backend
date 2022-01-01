import { StatusCodes } from 'http-status-codes';
import { sign } from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import config from '@/config';
import ApiError from '@/errors/ApiError';
import { UserLoginDto, UserRegisterDto } from '@/interfaces/user';
import RefreshToken from '@/models/refresh-token.model';
import UserService from '@/services/user.service';
import { comparePassword } from '@/utils/auth';

@Service()
export default class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @Inject() private userService: UserService,
  ) {}

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userService.findByEmail(userLoginDto.email);

    if (!user) {
      throw new ApiError({
        status: StatusCodes.NOT_FOUND,
        message: 'Pengguna tidak ditemukan!',
      });
    }

    const isPasswordValid = await comparePassword(
      userLoginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ApiError({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Password salah!',
      });
    }

    const refreshTokenInstance = this.refreshTokenRepository.create();

    const token = this.createToken(user.id);
    const refreshToken = await refreshTokenInstance.createToken(user);

    return { token, refreshToken };
  }

  async register(userRegisterDto: UserRegisterDto) {
    const isEmailExist = await this.userService.findByEmail(
      userRegisterDto.email,
    );

    if (isEmailExist) {
      throw new ApiError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Email telah digunakan!',
      });
    }

    const user = await this.userService.createUser(userRegisterDto);

    return user;
  }

  async verifyRefreshToken(requestToken: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: requestToken },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new ApiError({
        status: StatusCodes.FORBIDDEN,
        message: 'Refresh token tidak terdaftar!',
      });
    }

    if (refreshToken.verifyExpiration()) {
      this.refreshTokenRepository.delete(refreshToken);

      throw new ApiError({
        status: StatusCodes.FORBIDDEN,
        message: 'Refresh token expired!',
      });
    }

    const newToken = this.createToken(refreshToken.user.id);

    return newToken;
  }

  createToken(id: string) {
    return sign({ id }, config.jwtSecret as string, {
      expiresIn: parseInt(config.jwtExpire as string, 10),
    });
  }
}
