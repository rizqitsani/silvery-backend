import { body } from 'express-validator';

const authValidation = {
  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
  register: [
    body('full_name').isLength({ max: 100 }),
    body('telephone')
      .isLength({ min: 11, max: 15 })
      .matches(/^\+628[1-9][0-9]{7,11}$/),
    body('address').isAlphanumeric(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
};

export default authValidation;
