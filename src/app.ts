import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import config from '@/config';
import errorMiddleware from '@/middlewares/error';
import { createConnection } from 'typeorm';

const startServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(cors());
  app.use(cookieParser());

  await createConnection();

  app.use('/static', express.static('uploads'));

  const apiRoutes = express.Router();

  app.use('/api', apiRoutes);
  // apiRoutes.use('/v1', routes);

  // if error is not an instanceOf ApiError, convert it.
  app.use(errorMiddleware.converter);

  // catch 404 and forward to error handler
  app.use(errorMiddleware.notFound);

  // error handler, send stacktrace only during development
  app.use(errorMiddleware.handler);

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on port ${config.port} (${config.env})`);
  });
};

startServer();
