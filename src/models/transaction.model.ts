import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import Timestamp from '.';
import User from '@/models/user.model';
import TransactionDetail from '@/models/transaction-detail.model';

export enum ShippingStatusRole {
  WAITING_FOR_PAYMENT = 'Belum dibayar',
  PACKED = 'Dikemas',
  SHIPPED = 'Dikirim',
  DONE = 'Selesai',
}

@Entity('transaction')
export default class Transaction {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar' })
  midtrans_id: string;

  @Column({ type: 'int', nullable: false })
  total: number;

  @Column({ type: 'int', nullable: false })
  shipping_cost: number;

  @Column({ type: 'int', nullable: false })
  insurance_cost: number;

  @Column({ type: 'varchar' })
  payment_type: string;

  @Column({ type: 'varchar' })
  transaction_type: string;

  @Column({ type: 'varchar' })
  transaction_status: string;

  @Column({
    type: 'enum',
    enum: ShippingStatusRole,
    default: ShippingStatusRole.WAITING_FOR_PAYMENT,
  })
  shipping_status: ShippingStatusRole;

  @Column({ type: 'varchar' })
  fraud_status: string;

  @Column({ type: 'datetime' })
  transaction_time: Date;

  @Column({ type: 'datetime' })
  settlement_time: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => TransactionDetail, (detail) => detail.transaction, {
    cascade: true,
  })
  items: TransactionDetail[];

  @Column(() => Timestamp, { prefix: false })
  timestamp: Timestamp;
}
