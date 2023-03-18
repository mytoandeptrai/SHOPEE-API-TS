import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse, Meta } from 'utils/rest/response';
import * as service from './service';
import * as queries from './queries';

const getAllCarts = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getAllCarts(request, next);
  const meta = new Meta(result?.currentPage, result?.length, result?.total);

  if (result) new ApiResponse(result.data, 'OK', 200, Date.now() - request.startTime, Object(meta)).send(response);
};

const addToCart = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.addToCart(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const deleteSingleCart = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.deleteSingleCart(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const deleteAllCarts = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.deleteAllCarts(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { addToCart, deleteSingleCart, deleteAllCarts, getAllCarts };
