import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Container } from 'typeorm-typedi-extensions';

import config from '@/config';
import ApiError from '@/errors/ApiError';
import { verifyToken } from '@/middlewares/auth';
import validate from '@/middlewares/validate';
import AuthService from '@/services/auth.service';
import authValidation from '@/validations/auth.validation';

const router = Router();

router
  .route('/login')
  .post(validate(authValidation.login), async (req, res, next) => {
    try {
      const authServiceInstance = Container.get(AuthService);
      const { token, refreshToken } = await authServiceInstance.login(req.body);

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: config.refreshTokenExpire * 1000,
      });

      return res
        .status(StatusCodes.OK)
        .json({ message: 'Success.', data: { token, refreshToken } });
    } catch (error) {
      return next(error);
    }
  });

router
  .route('/register')
  .post(validate(authValidation.register), async (req, res, next) => {
    try {
      const authServiceInstance = Container.get(AuthService);
      const data = await authServiceInstance.register(req.body);

      return res.status(StatusCodes.OK).json({
        message: 'Success.',
        data,
      });
    } catch (error) {
      return next(error);
    }
  });

router.route('/info').get(verifyToken, async (req, res, next) => {
  try {
    return res.status(StatusCodes.OK).json({
      message: 'Success.',
      data: {
        id: req.user.id,
        role: req.user.role,
        name: req.user.full_name,
        email: req.user.email,
        phone: req.user.telephone,
        address: req.user.address,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.route('/refresh-token').post(async (req, res, next) => {
  try {
    const authServiceInstance = Container.get(AuthService);
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new ApiError({
        status: StatusCodes.FORBIDDEN,
        message: 'Refresh token tidak diberikan!',
      });
    }

    const token = await authServiceInstance.verifyRefreshToken(refreshToken);

    return res.status(StatusCodes.OK).json({
      message: 'Success.',
      data: {
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
