import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse } from 'utils/rest/response';
import * as queries from './queries';

const getAllBanner = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getAllBanner(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const getSingleBanner = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getSingleBanner(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { getAllBanner, getSingleBanner };
