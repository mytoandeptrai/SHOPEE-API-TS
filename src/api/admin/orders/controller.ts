import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse, Meta } from 'utils/rest/response';
import * as queries from './queries';
import * as service from './service';

const getAllOrders = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getAllOrders(request, next);
  const meta = new Meta(result?.currentPage, result?.length, result?.total);

  if (result) new ApiResponse(result.data, 'OK', 200, Date.now() - request.startTime, Object(meta)).send(response);
};

const updateStatusOfOrder = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.updateStatusOfOrder(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { updateStatusOfOrder, getAllOrders };
