import { NextFunction, Response } from 'express';
import { HttpException } from 'exceptions';
import RequestWithUser from 'utils/rest/request';

const errorMiddleware = (error: HttpException, req: RequestWithUser, res: Response, next: NextFunction) => {
  const errorCode = error?.errorCode || 'ERROR_CODE_NOT_FOUND';
  const time = Date.now() - req.startTime;
  const status = error?.status || 500;

  res.status(status).json({
    name: error.name,
    message: error.message,
    status,
    errorCode,
    time,
  });
};

export { errorMiddleware };
