import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { ProductModel } from 'models';
import ReviewModel from 'models/schemas/Review';
import RequestWithUser from 'utils/rest/request';

const createNewReview = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const { _id } = request?.user;
    const { rating, productId } = request.body;

    const existedProduct = await ProductModel.findById(productId);
    if (!existedProduct) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This product does not exist',
        StatusCode.BadRequest.name
      );
    }

    const reviewBody = {
      ...request.body,
      rating: Number(rating),
      user: _id,
    };

    const savedReview = await ReviewModel.create(reviewBody);

    const obj = await ReviewModel.aggregate([
      {
        $match: { productId: productId },
      },
    ]);
    console.log('🚀 ~ file: service.ts:36 ~ createNewReview ~ obj:', obj);

    // const reviewsDB = await ReviewModel.find({ productId }).lean();
    // existedProduct.rating = reviewsDB.reduce((acc, item: any) => item.rating + acc, 0) / reviewsDB.length;
    // await existedProduct.save();

    return savedReview;
  } catch (error) {
    next(error);
  }
};

const updateReview = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const userId = request.user?._id;
    const { rating, productId, comment } = request.body;
    const reviewId = request.params?.id;

    const existedProduct = await ProductModel.findById(productId);
    if (!existedProduct) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This product does not exist',
        StatusCode.BadRequest.name
      );
    }

    const existedReview = await ReviewModel.findById(reviewId);
    if (!existedReview) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This Review does not exist',
        StatusCode.BadRequest.name
      );
    }

    if (userId !== existedReview.user.toString()) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.Forbidden.status,
        'You do not have permission to add or edit this review',
        StatusCode.Forbidden.name
      );
    }

    const updateReviewBody = {
      rating: Number(rating),
      comment,
    };
    const updatedReview = await existedReview.updateOne({ $set: updateReviewBody }, { new: true });
    const reviewsDB = await ReviewModel.find({ productId }).lean();
    if (reviewsDB.length > 0) {
      const totalReviews = reviewsDB.length;
      const newRating = reviewsDB.reduce((acc, item: any) => item.rating + acc, 0) / totalReviews;
      existedProduct.rating = newRating;
      await existedProduct.save();
    }

    return updatedReview;
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const userId = request.user?._id;
    const reviewId = request.params?.id;

    const existedReview = await ReviewModel.findById(reviewId);
    if (!existedReview) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This Review does not exist',
        StatusCode.BadRequest.name
      );
    }

    if (userId !== existedReview.user.toString()) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.Forbidden.status,
        'You do not have permission to delete this review',
        StatusCode.Forbidden.name
      );
    }

    const existedProduct = await ProductModel.findById(existedReview.productId);
    await existedReview.remove();

    const reviewsDB = await ReviewModel.find({ productId: existedReview.productId });
    if (reviewsDB.length > 0) {
      const totalReviews = reviewsDB.length;
      const newRating = reviewsDB.reduce((acc, item: any) => item.rating + acc, 0) / totalReviews;
      existedProduct.rating = newRating;
      await existedProduct.save();
    }

    return existedReview;
  } catch (error) {
    next(error);
  }
};

export { createNewReview, updateReview, deleteReview };
