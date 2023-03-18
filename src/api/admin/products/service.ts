import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { ProductModel } from 'models';
import ShopModel from 'models/schemas/Shop';
import RequestWithUser from 'utils/rest/request';
import { CloudinaryUpload } from 'utils/uploads';

const createNewProduct = async (request: RequestWithUser, next: NextFunction) => {
  const cloudinary = new CloudinaryUpload();

  try {
    const images = request.files?.images;
    const image = request.files?.image;
    const shopId = request.params?.shopId;

    const currentShop = await ShopModel.findById(shopId);

    if (!currentShop) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'The shop does not exist',
        StatusCode.BadRequest.name
      );
    }

    if (Array.isArray(image)) {
      throw new HttpException(
        'TypeError',
        StatusCode.BadRequest.status,
        'Array is not allowed',
        StatusCode.BadRequest.name
      );
    }

    if (!Array.isArray(images)) {
      throw new HttpException(
        'TypeError',
        StatusCode.BadRequest.status,
        'Images must be an array',
        StatusCode.BadRequest.name
      );
    }

    const multipleImagePromises = images.map((el) => cloudinary.uploads(el, 'images'));
    const [imageResponse, imagesArrayResponse] = await Promise.all([
      cloudinary.uploads(image, 'images'),
      Promise.all(multipleImagePromises),
    ]);

    const requestBodyWithMedia = {
      ...request.body,
      image: imageResponse?.url,
      images: imagesArrayResponse?.map((el) => el?.url),
    };
    const result = await ProductModel.create(requestBodyWithMedia);

    return result;
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (request: RequestWithUser, next: NextFunction) => {
  const cloudinary = new CloudinaryUpload();

  try {
    const images = request.files?.images;
    const image = request.files?.image;

    if (Array.isArray(image)) {
      throw new HttpException(
        'TypeError',
        StatusCode.BadRequest.status,
        'Array is not allowed',
        StatusCode.BadRequest.name
      );
    }

    if (!Array.isArray(images)) {
      throw new HttpException(
        'TypeError',
        StatusCode.BadRequest.status,
        'Images must be an array',
        StatusCode.BadRequest.name
      );
    }

    if (images.every((el) => typeof el === 'string') && typeof image === 'string') {
      const updateDoc = {
        $set: {
          ...request.body,
        },
      };

      const result = await ProductModel.findOneAndUpdate({ _id: request.params.id }, updateDoc, { new: true });

      if (!result) {
        throw new HttpException(
          'NotFoundError',
          StatusCode.BadRequest.status,
          'This product does not exist',
          StatusCode.BadRequest.name
        );
      }

      return result;
    }

    const multipleImagePromises = images.map((el) => cloudinary.uploads(el, 'images'));
    const [imageResponse, imagesArrayResponse] = await Promise.all([
      cloudinary.uploads(image, 'images'),
      Promise.all(multipleImagePromises),
    ]);

    const requestBodyWithMedia = {
      ...request.body,
      image: imageResponse?.url,
      images: imagesArrayResponse?.map((el) => el?.url),
    };
    const result = await ProductModel.create(requestBodyWithMedia);

    return result;
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(request.params.id);
    if (!deletedProduct) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This product does not exist',
        StatusCode.BadRequest.name
      );
    }

    return deletedProduct;
  } catch (error) {
    next(error);
  }
};

export { createNewProduct, updateProduct, deleteProduct };
