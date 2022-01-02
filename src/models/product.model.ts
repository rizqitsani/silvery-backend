import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import Timestamp from '.';
import ProductPhoto from './product-photo.model';

@Entity('product')
export default class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int', default: 0, nullable: false })
  stock: number;

  @Column({ type: 'boolean', default: false, nullable: false })
  available: boolean;

  @OneToMany(() => ProductPhoto, (productPhoto) => productPhoto.product, {
    cascade: true,
  })
  photos: ProductPhoto[];

  @Column(() => Timestamp, { prefix: false })
  timestamp: Timestamp;
}
