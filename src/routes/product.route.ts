import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Container } from 'typeorm-typedi-extensions';

import { imageUpload } from '@/config/multer';
import { isAdmin, verifyToken } from '@/middlewares/auth';
import validate from '@/middlewares/validate';
import ProductService from '@/services/product.service';
import productValidation from '@/validations/product.validation';

const router = Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const productServiceInstance = Container.get(ProductService);
      const products = await productServiceInstance.getAll();

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Success.', data: products });
    } catch (error) {
      return next(error);
    }
  })
  .post(
    [verifyToken, isAdmin],
    imageUpload.array('image', 4),
    validate(productValidation.addProduct),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productServiceInstance = Container.get(ProductService);
        const product = await productServiceInstance.createProduct(
          req.body,
          req.files as Express.Multer.File[],
        );

        return res
          .status(StatusCodes.OK)
          .json({ message: 'Success.', data: product });
      } catch (error) {
        return next(error);
      }
    },
  );

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      const productServiceInstance = Container.get(ProductService);

      const { id } = req.params;
      const product = await productServiceInstance.findById(id);

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Success.', data: product });
    } catch (error) {
      return next(error);
    }
  })
  .put(
    [verifyToken, isAdmin],
    imageUpload.array('image', 4),
    validate(productValidation.updateProduct),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productServiceInstance = Container.get(ProductService);

        const { id } = req.params;
        const updatedProduct = await productServiceInstance.updateProduct(
          id,
          req.body,
          req.files as Express.Multer.File[],
        );

        return res
          .status(StatusCodes.OK)
          .json({ message: 'Success.', data: updatedProduct });
      } catch (error) {
        return next(error);
      }
    },
  )
  .delete(
    [verifyToken, isAdmin],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productServiceInstance = Container.get(ProductService);

        const { id } = req.params;
        await productServiceInstance.deleteProduct(id);

        return res.status(StatusCodes.OK).json({ message: 'Success.' });
      } catch (error) {
        return next(error);
      }
    },
  );

export default router;
