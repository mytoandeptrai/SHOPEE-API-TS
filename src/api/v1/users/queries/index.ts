import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { UserModel } from 'models';
import RequestWithUser from 'utils/rest/request';

const getSingleUser = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const user = await UserModel.findOne({ _id: request.params.id }).select('-password');

    if (!user) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.NotFound.status,
        'User not exists!',
        StatusCode.NotFound.name
      );
    }

    return user;
  } catch (error) {
    next(error);
  }
};

export { getSingleUser };
