import { format, parse } from 'date-fns';
import { nanoid } from 'nanoid';
import {
  Column,
  Entity,
  getRepository,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Timestamp from '.';
import User from '@/models/user.model';
import config from '@/config';

@Entity('refresh_token')
export default class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 21, unique: true, nullable: false })
  token: string;

  @Column({ type: 'date', nullable: false })
  expiry_date: string;

  @OneToOne(() => User, (user) => user.refresh_token)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  async createToken(user: User) {
    const refreshTokenRepository = getRepository(RefreshToken);

    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + config.refreshTokenExpire);
    const formattedExpiredAt = format(expiredAt, 'yyyy-MM-dd HH:mm:ss');

    const existingRefreshToken = await refreshTokenRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existingRefreshToken) {
      const token = nanoid();

      existingRefreshToken.token = token;
      existingRefreshToken.expiry_date = formattedExpiredAt;

      await refreshTokenRepository.save(existingRefreshToken);

      return existingRefreshToken.token;
    }

    const refreshToken = refreshTokenRepository.create({
      token: nanoid(),
      user: {
        id: user.id,
      },
      expiry_date: formattedExpiredAt,
    });

    await refreshTokenRepository.save(refreshToken);

    return refreshToken.token;
  }

  verifyExpiration() {
    return (
      parse(this.expiry_date, 'yyyy-MM-dd HH:mm:ss', new Date()).getTime() <
      new Date().getTime()
    );
  }
}
