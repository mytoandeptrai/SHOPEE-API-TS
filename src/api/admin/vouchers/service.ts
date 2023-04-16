import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { VoucherModel } from 'models';
import RequestWithUser from 'utils/rest/request';

const createVoucher = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const voucherDB = await VoucherModel.findOne({ code: request.body.code }).exec();
    if (voucherDB) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.NotAcceptable.status,
        'The shop is already existed!',
        StatusCode.NotAcceptable.name
      );
    }
    const newVoucher = new VoucherModel(request.body);
    const savedVoucher = await newVoucher.save();
    return savedVoucher;
  } catch (error) {
    next(error);
  }
};

const deleteVoucher = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const voucherDB = await VoucherModel.findById(request.params.voucherId).exec();
    if (!voucherDB) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'The shop does not exist!',
        StatusCode.BadRequest.name
      );
    }
    const savedVoucher = await voucherDB.remove();
    return savedVoucher;
  } catch (error) {
    next(error);
  }
};

const updateVoucher = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const voucherDB = await VoucherModel.findById(request.params.voucherId).exec();
    if (!voucherDB) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'The shop does not exist!',
        StatusCode.BadRequest.name
      );
    }
    const savedVoucher = await voucherDB.updateOne(request.body);
    return savedVoucher;
  } catch (error) {
    next(error);
  }
};

export { createVoucher, updateVoucher, deleteVoucher };
