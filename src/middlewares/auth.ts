import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import config from '@/config';
import ApiError from '@/errors/ApiError';
import User from '@/models/user.model';

export const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(' ')?.[1];

    if (!token) {
      throw new ApiError({
        status: StatusCodes.FORBIDDEN,
        message: 'Token tidak diberikan!',
      });
    }

    const decoded = <{ id: string }>verify(token, config.jwtSecret as string);

    const userRepository = getRepository(User);
    const user = await userRepository.findOne(decoded.id);

    if (!user) {
      throw new ApiError({
        status: StatusCodes.FORBIDDEN,
        message: 'Token tidak valid!',
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

export const isAdmin: RequestHandler = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ApiError({
        status: StatusCodes.FORBIDDEN,
        message: 'Tidak mempunyai akses!',
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
