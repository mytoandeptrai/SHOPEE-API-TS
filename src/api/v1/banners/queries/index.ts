import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { BannerModel } from 'models';
import RequestWithUser from 'utils/rest/request';

const getAllBanner = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const banners = await BannerModel.find().sort({ createdAt: -1 });
    return banners;
  } catch (error) {
    next(error);
  }
};

const getSingleBanner = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const banner = await BannerModel.findById(request.params.id);
    if (!banner) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.NotFound.status,
        'This banner is not exists!',
        StatusCode.NotFound.name
      );
    }

    return banner;
  } catch (error) {
    next(error);
  }
};

export { getAllBanner, getSingleBanner };
