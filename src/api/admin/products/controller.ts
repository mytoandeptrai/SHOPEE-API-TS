import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse } from 'utils/rest/response';
import * as service from './service';

const createNewProduct = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.createNewProduct(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const deleteProduct = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.deleteProduct(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const updateProduct = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.updateProduct(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { createNewProduct, deleteProduct, updateProduct };
