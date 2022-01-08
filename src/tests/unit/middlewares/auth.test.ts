import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import ApiError from '@/errors/ApiError';
import { verifyToken } from '@/middlewares/auth';

describe('Auth middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });

  test('Should throw error if no authorization header provided', () => {
    mockRequest = {
      headers: {},
    };

    verifyToken(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toBeCalledWith(
      new ApiError({
        status: StatusCodes.FORBIDDEN,
        message: 'Token tidak diberikan!',
      }),
    );
  });
});
