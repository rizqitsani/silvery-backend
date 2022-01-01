import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTransactionTable1640849534483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'midtrans_id',
            type: 'varchar',
          },
          {
            name: 'total',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'shipping_cost',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'insurance_cost',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'payment_type',
            type: 'varchar',
          },
          {
            name: 'transaction_type',
            type: 'varchar',
          },
          {
            name: 'transaction_status',
            type: 'varchar',
          },
          {
            name: 'shipping_status',
            type: 'varchar',
          },
          {
            name: 'fraud_status',
            type: 'varchar',
          },
          {
            name: 'transaction_time',
            type: 'date',
          },
          {
            name: 'settlement_time',
            type: 'date',
          },
          {
            name: 'created_at',
            type: 'datetime',
            length: '6',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            length: '6',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'transaction',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transaction', 'user_id');
    await queryRunner.dropTable('transaction');
  }
}
