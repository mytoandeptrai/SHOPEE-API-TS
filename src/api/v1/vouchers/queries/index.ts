import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { APIFeatures } from 'libs/APIFeatures';
import { VoucherModel } from 'models';
import { DEFAULT_PAGING } from 'utils/constants';
import RequestWithUser from 'utils/rest/request';

const getVoucherOfUser = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const { code, status } = request.query;

    const userId = request.user._id;

    let condition: any = {
      expirationDate: { $gt: Date.now() },
      usersSave: userId,
      usersUsed: { $ne: userId },
    };

    if (code) condition.code = { $regex: code, $options: 'i' };
    if (status === 'expiration') condition.expirationDate = { $lt: Date.now() };
    if (status === 'used') condition.usersUsed = userId;
    const vouchers = await VoucherModel.find(condition).sort({ updatedAt: -1 });

    if (!vouchers) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.NotFound.status,
        'Voucher does not exist!',
        StatusCode.NotFound.name
      );
    }

    return vouchers;
  } catch (error) {
    next(error);
  }
};

const getSingleVoucher = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const voucher = await VoucherModel.findById(request.params.voucherId);
    if (!voucher) {
      throw new HttpException(
        'TypeError',
        StatusCode.NotFound.status,
        'This voucher does not exist',
        StatusCode.NotFound.name
      );
    }

    return voucher;
  } catch (error) {
    next(error);
  }
};

const getAllVouchers = async (request: RequestWithUser, next: NextFunction) => {
  const { code, status, page = DEFAULT_PAGING.CURRENT_PAGE, limit = DEFAULT_PAGING.LIMIT_PER_PAGE } = request.query;
  let condition: any = { expirationDate: { $gt: Date.now() } };
  if (code) condition.code = { $regex: code, $options: 'i' };
  if (status === 'expiration') condition.expirationDate = { $lt: Date.now() };

  try {
    const feature = new (APIFeatures as any)(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      VoucherModel.find(condition).select({ __v: 0, description: 0 }).lean(),
      request.query
    )
      .paginating()
      .productSorting();

    const [vouchers, totalVouchers] = await Promise.all([
      feature.query,
      VoucherModel.find(condition).countDocuments().lean(),
    ]);

    const totalPage = Math.ceil(totalVouchers / Number(limit)) || 1;

    const response = {
      data: vouchers,
      currentPage: Number(page),
      length: Number(limit),
      total: totalPage,
    };

    return response;
  } catch (error) {
    next(error);
  }
};

const getAllPublicVouchers = async (request: RequestWithUser, next: NextFunction) => {
  const { page = DEFAULT_PAGING.CURRENT_PAGE, limit = DEFAULT_PAGING.LIMIT_PER_PAGE } = request.query;
  let condition: any = { expirationDate: { $gt: Date.now() }, isPublic: true };

  try {
    const feature = new (APIFeatures as any)(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      VoucherModel.find(condition).select({ __v: 0, description: 0 }).lean(),
      request.query
    )
      .paginating()
      .productSorting();

    const [vouchers, totalVouchers] = await Promise.all([
      feature.query,
      VoucherModel.find(condition).countDocuments().lean(),
    ]);

    const totalPage = Math.ceil(totalVouchers / Number(limit)) || 1;

    const response = {
      data: vouchers,
      currentPage: Number(page),
      length: Number(limit),
      total: totalPage,
    };

    return response;
  } catch (error) {
    next(error);
  }
};

export { getVoucherOfUser, getSingleVoucher, getAllVouchers, getAllPublicVouchers };
