import config from '@/config';
import ApiError from '@/errors/ApiError';
import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TokenExpiredError } from 'jsonwebtoken';

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler: ErrorRequestHandler = (err, req, res) => {
  const response = {
    code: err.status,
    message: err.message || StatusCodes[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  if (config.env !== 'development') {
    delete response.stack;
  }

  res.status(err.status);
  res.json(response);
};

/**
 * If error is not an instanceOf ApiError, convert it.
 * @public
 */
const converter: ErrorRequestHandler = (err, req, res, next) => {
  let convertedError = err;

  if (err instanceof TokenExpiredError) {
    convertedError = new ApiError({
      message: 'JWT expired!',
      status: StatusCodes.FORBIDDEN,
      stack: err.stack,
    });
  } else if (!(err instanceof ApiError)) {
    convertedError = new ApiError({
      message: err.message,
      status: err.status || 500,
      stack: err.stack,
    });
  }

  return handler(convertedError, req, res, next);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
const notFound: RequestHandler = (req, res, next) => {
  const err = new ApiError({
    message: 'Not found!',
    status: StatusCodes.NOT_FOUND,
  });
  next(err);
};

const errorMiddleware = { handler, converter, notFound };

export default errorMiddleware;
