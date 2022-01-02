import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Container } from 'typeorm-typedi-extensions';

import { verifyToken } from '@/middlewares/auth';
import validate from '@/middlewares/validate';
import CartService from '@/services/cart.service';
import cartValidation from '@/validations/cart.validation';

const router = Router();

router
  .route('/')
  .get(
    [verifyToken],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cartServiceInstance = Container.get(CartService);

        const userId = req.user.id;

        const cart = await cartServiceInstance.findByUserId(userId);
        const total = cartServiceInstance.calculateCartTotal(cart);

        return res
          .status(StatusCodes.OK)
          .json({ message: 'Success.', data: { items: cart, total } });
      } catch (error) {
        return next(error);
      }
    },
  )
  .post(
    [verifyToken],
    validate(cartValidation.addCart),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cartServiceInstance = Container.get(CartService);

        const userId = req.user.id;
        const productId = req.body.product_id;

        const cart = await cartServiceInstance.createCart(userId, productId);

        return res
          .status(StatusCodes.OK)
          .json({ message: 'Success.', data: cart });
      } catch (error) {
        return next(error);
      }
    },
  )
  .put(
    [verifyToken],
    validate(cartValidation.updateCart),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cartServiceInstance = Container.get(CartService);

        const userId = req.user.id;
        const { quantity, product_id: productId } = req.body;

        const updatedCart = await cartServiceInstance.updateCart(
          userId,
          productId,
          quantity,
        );

        return res
          .status(StatusCodes.OK)
          .json({ message: 'Success.', data: updatedCart });
      } catch (error) {
        return next(error);
      }
    },
  )
  .delete(
    [verifyToken],
    validate(cartValidation.deleteCart),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cartServiceInstance = Container.get(CartService);

        const userId = req.user.id;
        const productId = req.body.product_id;

        await cartServiceInstance.deleteCart(userId, productId);

        return res.status(StatusCodes.OK).json({ message: 'Success.' });
      } catch (error) {
        return next(error);
      }
    },
  );

export default router;
