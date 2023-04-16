import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { VoucherModel } from 'models';
import RequestWithUser from 'utils/rest/request';

const saveVoucher = async (request: RequestWithUser, next: NextFunction) => {
  const userId = request.user._id;
  try {
    const voucher = await VoucherModel.findOne({ code: request.query.code });
    if (!voucher) {
      throw new HttpException(
        'TypeError',
        StatusCode.NotFound.status,
        'This voucher does not exist',
        StatusCode.NotFound.name
      );
    }
    if (new Date(voucher.expirationDate).getTime() < new Date().getTime()) {
      throw new HttpException(
        'TypeError',
        StatusCode.UnProcessable.status,
        'This voucher is expired',
        StatusCode.UnProcessable.name
      );
    }
    if (voucher.usersUsed.indexOf(userId) !== -1) {
      throw new HttpException(
        'TypeError',
        StatusCode.UnProcessable.status,
        'This voucher is used',
        StatusCode.UnProcessable.name
      );
    }
    if (voucher.usersSave.indexOf(userId) !== -1) {
      throw new HttpException(
        'TypeError',
        StatusCode.UnProcessable.status,
        'This voucher is already existed',
        StatusCode.UnProcessable.name
      );
    }

    voucher.usersSave.push(userId);
    await voucher.save();
    return voucher;
  } catch (error) {
    next(error);
  }
};

export { saveVoucher };
