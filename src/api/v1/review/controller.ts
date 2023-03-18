import { NextFunction, Response } from 'express';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse } from 'utils/rest/response';
import * as queries from './queries';
import * as service from './service';

const getAllReviewOfProduct = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getAllReviewOfProduct(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const getAllReviewOfOrder = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getAllReviewOfOrder(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const getSingleReview = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await queries.getSingleReview(request, next);

  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const createNewReview = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.createNewReview(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const deleteReview = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.deleteReview(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

const updateReview = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const result = await service.updateReview(request, next);
  if (result) new ApiResponse(result, 'OK', 200, Date.now() - request.startTime).send(response);
};

export { createNewReview, deleteReview, updateReview, getAllReviewOfProduct, getAllReviewOfOrder, getSingleReview };
