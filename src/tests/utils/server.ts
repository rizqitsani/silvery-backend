import cookieParser from 'cookie-parser';
import express from 'express';

import routes from '@/routes';
import connection from '@/tests/utils/database';

async function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  const apiRoutes = express.Router();

  app.use('/api', apiRoutes);
  apiRoutes.use('/v1', routes);

  await connection.create();
  await connection.migrate();

  return app;
}

export default createServer;
