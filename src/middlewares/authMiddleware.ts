import config from 'config';
import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import RequestWithUser from 'utils/rest/request';

const protectRouteMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization || req.headers.authorization === 'Bearer undefined') {
      throw new HttpException(
        'AuthenticationError',
        StatusCode.Unauthorized.status,
        'You are not logged in',
        StatusCode.Unauthorized.name
      );
    }

    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    const verify = jwt.verify(token, config.jwt.jwtAccessTokenSecret);
    req.user = verify;
    next();
  } catch (error: any) {
    next({
      name: error.name,
      message: error.message,
      status: StatusCode.Unauthorized.status,
    });
  }
};

const authorizeMiddleware = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      throw new HttpException(
        'AuthenticationError',
        StatusCode.Forbidden.status,
        `The ${req.user.role} cannot access this route`,
        StatusCode.Forbidden.name
      );
    }

    next();
  };
};

const authMiddleware = {
  protectRouteMiddleware,
  authorizeMiddleware,
};

export default authMiddleware;
