import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { ReviewModel } from 'models';
import RequestWithUser from 'utils/rest/request';

const getAllReviewOfProduct = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const reviews = await ReviewModel.find({ productId: request.params.id })
      .populate({
        path: 'user',
        select: 'fullname avatar email _id',
      })
      .sort({ updatedAt: -1 });

    return reviews;
  } catch (error) {
    next(error);
  }
};

const getAllReviewOfOrder = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const reviews = await ReviewModel.find({ orderId: request.params.id })
      .populate({
        path: 'user',
        select: 'fullname avatar email _id',
      })
      .sort({ updatedAt: -1 });

    return reviews;
  } catch (error) {
    next(error);
  }
};

const getSingleReview = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const existedReview = await ReviewModel.find({ _id: request.params.id }).populate({
      path: 'user',
      select: 'fullname avatar email _id',
    });

    if (!existedReview) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This Review does not exist',
        StatusCode.BadRequest.name
      );
    }

    return existedReview;
  } catch (error) {
    next(error);
  }
};

export { getAllReviewOfProduct, getAllReviewOfOrder, getSingleReview };
