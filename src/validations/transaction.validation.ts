import { body } from 'express-validator';

export default {
  getToken: [
    body('total').isInt({ gt: 0 }),
    body('shipping').isInt({ gt: 0 }),
    body('insurance').isInt({ gt: 0 }),
  ],
  updateTransaction: [body('status').isString()],
};
