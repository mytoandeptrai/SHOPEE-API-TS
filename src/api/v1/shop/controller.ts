import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse, Meta } from 'utils/rest/response';
import * as service from './service';
import * as queries from './queries';

const getAllShops = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getAllShops(request, next);
  const meta = new Meta(result?.currentPage, result?.length, result?.total);

  if (result) new ApiResponse(result.data, 'OK', 200, Date.now() - request.startTime, Object(meta)).send(response);
};

const getSingleShop = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getSingleShop(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const createNewShop = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.createNewShop(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const deleteShop = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.deleteShop(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const updateCurrentShop = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.updateCurrentShop(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { createNewShop, deleteShop, updateCurrentShop, getAllShops, getSingleShop };
