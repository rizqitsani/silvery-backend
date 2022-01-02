import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Timestamp from '.';
import Product from '@/models/product.model';
import Transaction from '@/models/transaction.model';

@Entity('transaction_detail')
export default class TransactionDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.items)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Product, (product) => product.photos)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column(() => Timestamp, { prefix: false })
  timestamp: Timestamp;
}
