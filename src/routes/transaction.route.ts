import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Container } from 'typeorm-typedi-extensions';

import snap from '@/config/midtrans';
import { isAdmin, verifyToken } from '@/middlewares/auth';
import validate from '@/middlewares/validate';
import TransactionService from '@/services/transaction.service';
import transactionValidation from '@/validations/transaction.validation';

const router = Router();

router.route('/').get(verifyToken, async (req, res, next) => {
  try {
    const transactionServiceInstance = Container.get(TransactionService);

    const userId = req.user.id;

    const transactions = await transactionServiceInstance.findByUserId(userId);

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Success.', data: transactions });
  } catch (error) {
    return next(error);
  }
});

router
  .route('/all')
  .get(
    [verifyToken, isAdmin],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const transactionServiceInstance = Container.get(TransactionService);

        const transactions = await transactionServiceInstance.getAll();

        return res
          .status(StatusCodes.OK)
          .json({ message: 'Success.', data: transactions });
      } catch (error) {
        return next(error);
      }
    },
  );

router
  .route('/token')
  .post(
    verifyToken,
    validate(transactionValidation.getToken),
    async (req, res, next) => {
      try {
        const transactionServiceInstance = Container.get(TransactionService);

        const { user } = req;
        const { total, shipping, insurance, type } = req.body;

        const transaction = await transactionServiceInstance.createTransaction(
          user,
          {
            total,
            shipping,
            insurance,
            type,
          },
        );

        const parameter = {
          transaction_details: {
            order_id: transaction.id,
            gross_amount: total + shipping + insurance,
          },
          callbacks: {
            finish: 'http://localhost:3000/orders',
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            first_name: user.full_name,
            last_name: '',
            email: user.email,
            phone: user.telephone,
          },
        };

        const midtransResult = await snap.createTransaction(parameter);

        return res.status(StatusCodes.OK).json({
          message: 'Success.',
          data: { ...midtransResult, id: transaction.id },
        });
      } catch (error) {
        return next(error);
      }
    },
  );

router.route('/notification').post(async (req, res, next) => {
  try {
    const transactionServiceInstance = Container.get(TransactionService);

    const response = await snap.transaction.notification(req.body);
    await transactionServiceInstance.updateTransactionStatus(response);

    return res.status(StatusCodes.OK);
  } catch (error) {
    return next(error);
  }
});

router
  .route('/:id')
  .get(verifyToken, async (req, res, next) => {
    try {
      const transactionServiceInstance = Container.get(TransactionService);

      const { id } = req.params;

      const transaction = await transactionServiceInstance.findById(id);

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Success.', data: transaction });
    } catch (error) {
      return next(error);
    }
  })
  .put(
    [verifyToken, isAdmin],
    validate(transactionValidation.updateTransaction),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const transactionServiceInstance = Container.get(TransactionService);

        const { id } = req.params;
        const { status } = req.body;

        await transactionServiceInstance.updateShipmentStatus(id, status);

        return res.status(StatusCodes.OK).json({ message: 'Success.' });
      } catch (error) {
        return next(error);
      }
    },
  )
  .delete(verifyToken, async (req, res, next) => {
    try {
      const transactionServiceInstance = Container.get(TransactionService);

      const transactionId = req.params.id;

      await transactionServiceInstance.deleteTransaction(transactionId);

      return res.status(StatusCodes.OK).json({ message: 'Success.' });
    } catch (error) {
      return next(error);
    }
  });

export default router;
