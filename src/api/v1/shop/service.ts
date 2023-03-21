import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { ShopModel } from 'models';
import RequestWithUser from 'utils/rest/request';
import { CloudinaryUpload } from 'utils/uploads';

const createNewShop = async (request: RequestWithUser, next: NextFunction) => {
  const cloudinary = new CloudinaryUpload();

  const { _id } = request?.user;
  const avatar = request.files?.avatar;
  try {
    const existedShop = await ShopModel.findOne({ user: _id });

    if (existedShop) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This shop is existed',
        StatusCode.BadRequest.name
      );
    }

    if (Array.isArray(avatar)) {
      throw new HttpException(
        'TypeError',
        StatusCode.BadRequest.status,
        'Shop Image must be a file',
        StatusCode.BadRequest.name
      );
    }

    const shopImageResponse = await cloudinary.uploads(avatar, 'images');

    const shopBody = {
      ...request.body,
      user: _id,
      avatar: shopImageResponse?.url,
    };
    const result = await ShopModel.create(shopBody);

    return result;
  } catch (error) {
    next(error);
  }
};

const updateCurrentShop = async (request: RequestWithUser, next: NextFunction) => {
  try {
    let existedShop = await ShopModel.findById(request.params.id);
    if (!existedShop) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This shop do not exist',
        StatusCode.BadRequest.name
      );
    }

    if (existedShop.user.toString() !== request.user._id) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.Unauthorized.status,
        `This User cannot update this shop`,
        StatusCode.Unauthorized.name
      );
    }

    existedShop = await existedShop.updateOne({ $set: request.body }, { new: true });
    return existedShop;
  } catch (error) {
    next(error);
  }
};

const deleteShop = async (request: RequestWithUser, next: NextFunction) => {
  try {
    let existedShop = await ShopModel.findById(request.params.id);
    if (!existedShop) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This shop do not exist',
        StatusCode.BadRequest.name
      );
    }

    if (existedShop.user.toString() !== request.user._id) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.Unauthorized.status,
        `This User cannot delete this shop`,
        StatusCode.Unauthorized.name
      );
    }

    await existedShop.remove();
    return existedShop;
  } catch (error) {
    next(error);
  }
};

export { createNewShop, updateCurrentShop, deleteShop };
