import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse } from 'utils/rest/response';
import * as service from './service';

const createVoucher = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.createVoucher(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};
const updateVoucher = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.updateVoucher(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const deleteVoucher = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.deleteVoucher(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { createVoucher, deleteVoucher, updateVoucher };
