import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default class Timestamp {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
