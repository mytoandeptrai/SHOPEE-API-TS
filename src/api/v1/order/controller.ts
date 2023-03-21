import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse, Meta } from 'utils/rest/response';
import * as service from './service';
import * as queries from './queries';

const getAllOrderOfUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getAllOrderOfUser(request, next);
  const meta = new Meta(result?.currentPage, result?.length, result?.total);

  if (result) new ApiResponse(result.data, 'OK', 200, Date.now() - request.startTime, Object(meta)).send(response);
};

const createNewOrder = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.createNewOrder(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const deleteOrder = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.deleteOrder(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { createNewOrder, deleteOrder, getAllOrderOfUser };
