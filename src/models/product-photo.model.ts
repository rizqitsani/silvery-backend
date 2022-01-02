import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Timestamp from '.';
import Product from '@/models/product.model';

@Entity('product_photo')
export default class ProductPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  photo_link: string;

  @ManyToOne(() => Product, (product) => product.photos)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column(() => Timestamp, { prefix: false })
  timestamp: Timestamp;
}
