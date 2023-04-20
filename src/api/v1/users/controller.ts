import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse } from 'utils/rest/response';
import * as service from './service';
import * as queries from './queries';

const getSingleUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getSingleUser(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const createUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.createUser(request.body);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const updateUser = async (request: RequestWithUser, response: Response, next: NextFunction): Promise<any> => {
  const result = await service.updateUser(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const updateAvatar = async (request: RequestWithUser, response: Response, next: NextFunction): Promise<any> => {
  const result = await service.updateAvatar(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { createUser, updateUser, updateAvatar, getSingleUser };
