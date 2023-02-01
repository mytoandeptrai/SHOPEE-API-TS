import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse } from 'utils/rest/response';
import * as service from './service';

const insertProduct = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.insertProduct(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const insertCategory = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.insertCategory(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const insertVoucher = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.insertVoucher(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { insertProduct, insertCategory, insertVoucher };
