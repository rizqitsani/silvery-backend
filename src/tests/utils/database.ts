import { createConnection, getConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

const connection = {
  async create() {
    useContainer(Container);
    await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'mppl_silvery_test',
      logging: false,
      entities: ['src/models/**/*.ts'],
      migrations: ['src/migrations/**/*.ts'],
    });
  },

  async close() {
    await getConnection().close();
  },

  async migrate() {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
  },
};

export default connection;
