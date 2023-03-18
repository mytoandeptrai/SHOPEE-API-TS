import { NextFunction } from 'express';
import { APIFeatures } from 'libs/APIFeatures';
import { CartModel } from 'models';
import { DEFAULT_PAGING } from 'utils/constants';
import RequestWithUser from 'utils/rest/request';

const getAllCarts = async (request: RequestWithUser, next: NextFunction) => {
  const userId = request.user._id;

  try {
    const { page = DEFAULT_PAGING.CURRENT_PAGE, limit = DEFAULT_PAGING.LIMIT_PER_PAGE } = request.query;
    const feature = new (APIFeatures as any)(
      CartModel.find({ user: userId })
        .populate({ path: 'product', populate: { path: 'category' } })
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .select({ __v: 0, description: 0 })
        .lean(),
      request.query
    )
      .paginating()
      .productSorting();

    const [carts, totalCarts] = await Promise.all([feature.query, CartModel.find().countDocuments().lean()]);

    const totalPage = Math.ceil(totalCarts / Number(limit)) || 1;

    const response = {
      data: carts,
      currentPage: Number(page),
      length: Number(limit),
      total: totalPage,
    };

    return response;
  } catch (error) {
    next(error);
  }
};

export { getAllCarts };
