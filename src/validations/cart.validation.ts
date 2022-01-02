import { body } from 'express-validator';

export default {
  addCart: [body('product_id').isString()],
  updateCart: [
    body('product_id').isString(),
    body('quantity').isInt({ gt: 0 }),
  ],
  deleteCart: [body('product_id').isString()],
};
