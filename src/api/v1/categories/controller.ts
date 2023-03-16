import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse } from 'utils/rest/response';
import * as queries from './queries';

const getAllCategories = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getAllCategories(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { getAllCategories };
