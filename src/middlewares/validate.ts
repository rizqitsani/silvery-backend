import { NextFunction, Request, Response } from 'express';
import {
  ErrorFormatter,
  ValidationChain,
  validationResult,
} from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const errorFormatter: ErrorFormatter = ({ location, msg, param }) =>
  `${location}[${param}]: ${msg}`;

const validate =
  (validations: ValidationChain[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const result = validationResult(req).formatWith(errorFormatter);

    if (!result.isEmpty()) {
      return next({ status: StatusCodes.BAD_REQUEST, message: result.array() });
    }

    return next();
  };

export default validate;
