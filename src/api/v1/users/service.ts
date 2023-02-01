import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { UserModel } from 'models';
import { User } from 'models/types';
import RequestWithUser from 'utils/rest/request';
import { CloudinaryUpload } from 'utils/uploads';

const createUser = async (user: User) => {
  const data = await UserModel.create(user);
  return data;
};

const updateUser = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const { body, user } = request;
    const { email, fullname, name, phone, street, address, city, district, ward, creditCard } = body;
    const isExists = await UserModel.findOne({ email });

    const userIdFound = isExists?._id?.toString();
    if (isExists && userIdFound !== user._id) {
      return next(
        new HttpException(
          'CreateError',
          StatusCode.BadRequest.status,
          'Username is already',
          StatusCode.BadRequest.name
        )
      );
    }

    const updateDoc = {
      $set: {
        email,
        fullname,
        name,
        phone,
        street,
        address,
        city,
        district,
        ward,
        creditCard,
      },
    };

    const result = await UserModel.findOneAndUpdate({ _id: user._id }, updateDoc, { new: true })
      .select({ password: 0 })
      .lean();

    return result;
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (request: RequestWithUser, next: NextFunction) => {
  const avatar = request?.files?.avatar;
  const user = request.user;
  try {
    if (!request.files) {
      throw new HttpException(
        'MissingError',
        StatusCode.BadRequest.status,
        'Missing files',
        StatusCode.BadRequest.name
      );
    }

    const cloudinary = new CloudinaryUpload();

    if (Array.isArray(avatar)) {
      throw new HttpException(
        'TypeError',
        StatusCode.BadRequest.status,
        'Array is not allowed',
        StatusCode.BadRequest.name
      );
    }

    const data = await cloudinary.uploads(avatar, 'image');
    if (data?.error === 'type error') {
      throw new HttpException(
        'TypeError',
        StatusCode.BadRequest.status,
        'Image is not allowed',
        StatusCode.BadRequest.name
      );
    }

    const updateDoc = {
      $set: {
        avatar: data ? data.url : undefined,
      },
    };

    await UserModel.findOneAndUpdate({ _id: user._id }, updateDoc);

    return data && data.url;
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const deletedUser = await UserModel.deleteOne({ _id: { $in: request.params.id } });
    if (!deletedUser) {
      throw new HttpException(
        'DeleteError',
        StatusCode.BadRequest.status,
        'User Not Found',
        StatusCode.BadRequest.name
      );
    }

    return deletedUser;
  } catch (error) {
    next(error);
  }
};

export { createUser, updateUser, updateAvatar, deleteUser };
