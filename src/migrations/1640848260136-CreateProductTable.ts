import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductTable1640848260136 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'price',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'stock',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'available',
            type: 'boolean',
            default: false,
            isNullable: false,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('product');
  }
}
