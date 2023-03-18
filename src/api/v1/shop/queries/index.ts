import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { APIFeatures } from 'libs/APIFeatures';
import ShopModel from 'models/schemas/Shop';
import { DEFAULT_PAGING } from 'utils/constants';
import RequestWithUser from 'utils/rest/request';

const getAllShops = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const { page = DEFAULT_PAGING.CURRENT_PAGE, limit = DEFAULT_PAGING.LIMIT_PER_PAGE } = request.query;
    const feature = new (APIFeatures as any)(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ShopModel.find().populate({ path: 'user' }).select({ __v: 0, description: 0 }).lean(),
      request.query
    ).paginating();

    const [shops, totalShops] = await Promise.all([feature.query, ShopModel.find().countDocuments().lean()]);

    const totalPage = Math.ceil(totalShops / Number(limit)) || 1;

    const response = {
      data: shops,
      currentPage: Number(page),
      length: Number(limit),
      total: totalPage,
    };

    return response;
  } catch (error) {
    next(error);
  }
};

const getSingleShop = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const shop = await ShopModel.findById(request.params.id);
    if (!shop) {
      throw new HttpException('TypeError', StatusCode.NotFound.status, 'Shop do not exist', StatusCode.NotFound.name);
    }

    return shop;
  } catch (error) {
    next(error);
  }
};
export { getAllShops, getSingleShop };
