import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { BannerModel } from 'models';
import RequestWithUser from 'utils/rest/request';
import { CloudinaryUpload } from 'utils/uploads';

const createNewBanner = async (request: RequestWithUser, next: NextFunction) => {
  const cloudinary = new CloudinaryUpload();
  const bannerUrl = request.files?.bannerUrl;

  try {
    if (Array.isArray(bannerUrl)) {
      throw new HttpException(
        'TypeError',
        StatusCode.BadRequest.status,
        'Banner must be a file',
        StatusCode.BadRequest.name
      );
    }

    const countBanners = await BannerModel.find().countDocuments();
    if (countBanners >= 6) {
      throw new HttpException(
        'TypeError',
        StatusCode.NotAcceptable.status,
        'There are not more than 6 banners',
        StatusCode.NotAcceptable.name
      );
    }

    const bannerImageResponse = await cloudinary.uploads(bannerUrl, 'images');

    const newBanner = new BannerModel({ bannerUrl: bannerImageResponse?.url });
    const savedBanner = await newBanner.save();
    return savedBanner;
  } catch (error) {
    next(error);
  }
};

const deleteBanner = async (request: RequestWithUser, next: NextFunction) => {
  const bannerInDB = await BannerModel.findByIdAndDelete(request.params.id).lean();
  if (!bannerInDB) {
    throw new HttpException(
      'TypeError',
      StatusCode.NotFound.status,
      'This banner does not exist',
      StatusCode.NotFound.name
    );
  }
  return bannerInDB;
};

const updateBanner = async (request: RequestWithUser, next: NextFunction) => {
  const cloudinary = new CloudinaryUpload();
  const bannerUrl = request.files?.bannerUrl;

  if (typeof bannerUrl === 'string') {
    const banner = await BannerModel.findById(request.params.id);
    return banner;
  }

  if (Array.isArray(bannerUrl)) {
    throw new HttpException(
      'TypeError',
      StatusCode.BadRequest.status,
      'Banner must be a file',
      StatusCode.BadRequest.name
    );
  }

  const bannerImageResponse = await cloudinary.uploads(bannerUrl, 'images');
  const updateDoc = {
    $set: {
      bannerUrl: bannerImageResponse?.url,
    },
  };
  const updatedBanner = await BannerModel.findOneAndUpdate({ _id: request.params.id }, updateDoc);

  if (!updatedBanner) {
    throw new HttpException(
      'TypeError',
      StatusCode.NotFound.status,
      'This banner does not exist',
      StatusCode.NotFound.name
    );
  }

  return updatedBanner;
};

export { updateBanner, createNewBanner, deleteBanner };
