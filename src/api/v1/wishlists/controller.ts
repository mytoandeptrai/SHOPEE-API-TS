import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse } from 'utils/rest/response';
import * as queries from './queries';
import * as service from './service';

const getUserWishLists = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getUserWishLists(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const addToWishList = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.addToWishList(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const removeFromWishList = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.removeFromWishList(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { addToWishList, removeFromWishList, getUserWishLists };
