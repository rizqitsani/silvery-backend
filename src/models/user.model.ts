import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Timestamp from '.';
import Cart from '@/models/cart.model';
import Transaction from '@/models/transaction.model';
import RefreshToken from '@/models/refresh-token.model';

import { hashPassword } from '@/utils/auth';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'varchar', nullable: false })
  full_name: string;

  @Column({ type: 'varchar', nullable: false })
  telephone: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refresh_token: RefreshToken;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Transaction, (transasction) => transasction.user)
  transactions: Transaction[];

  @Column(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hashPassword(this.password);
  }
}
