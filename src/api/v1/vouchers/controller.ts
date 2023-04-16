import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse, Meta } from 'utils/rest/response';
import * as queries from './queries';
import * as service from './service';

const getVoucherOfUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getVoucherOfUser(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const getSingleVoucher = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getSingleVoucher(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const getAllVouchers = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getAllVouchers(request, next);
  const meta = new Meta(result?.currentPage, result?.length, result?.total);

  if (result) new ApiResponse(result.data, 'OK', 200, Date.now() - request.startTime, Object(meta)).send(response);
};
const getAllPublicVouchers = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getAllPublicVouchers(request, next);
  const meta = new Meta(result?.currentPage, result?.length, result?.total);

  if (result) new ApiResponse(result.data, 'OK', 200, Date.now() - request.startTime, Object(meta)).send(response);
};

const saveVoucher = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.saveVoucher(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { getVoucherOfUser, getSingleVoucher, getAllPublicVouchers, getAllVouchers, saveVoucher };
