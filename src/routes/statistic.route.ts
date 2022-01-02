import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Container } from 'typeorm-typedi-extensions';

import { isAdmin, verifyToken } from '@/middlewares/auth';
import ProductService from '@/services/product.service';
import TransactionService from '@/services/transaction.service';
import UserService from '@/services/user.service';

const router = Router();

router
  .route('/')
  .get(
    [verifyToken, isAdmin],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productServiceInstance = Container.get(ProductService);
        const transactionServiceInstance = Container.get(TransactionService);
        const userServiceInstance = Container.get(UserService);

        const product = await productServiceInstance.getStatistics();
        const transaction = await transactionServiceInstance.getStatistics();
        const user = await userServiceInstance.getStatistics();

        return res
          .status(StatusCodes.OK)
          .json({ message: 'Success.', data: { product, transaction, user } });
      } catch (error) {
        return next(error);
      }
    },
  );

export default router;
