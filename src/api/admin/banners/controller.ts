import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse } from 'utils/rest/response';
import * as service from './service';

const createNewBanner = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.createNewBanner(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const deleteBanner = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.deleteBanner(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const updateBanner = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.updateBanner(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { createNewBanner, deleteBanner, updateBanner };
