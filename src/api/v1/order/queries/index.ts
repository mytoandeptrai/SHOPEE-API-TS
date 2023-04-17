import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { APIFeatures } from 'libs/APIFeatures';
import { OrderModel } from 'models';
import { DEFAULT_PAGING } from 'utils/constants';
import RequestWithUser from 'utils/rest/request';

const getAllOrderOfUser = async (request: RequestWithUser, next: NextFunction) => {
  const userId = request.user?._id;
  let { status, orderId, page = DEFAULT_PAGING.CURRENT_PAGE, limit = DEFAULT_PAGING.LIMIT_PER_PAGE } = request.query;
  page = Number(page);
  limit = Number(limit);
  let conditions: any = { user: userId };
  if (status) conditions.status = status;
  if (orderId) conditions._id = orderId;

  try {
    const feature = new (APIFeatures as any)(
      OrderModel.find(conditions)
        .populate('user', 'id fullname email')
        .populate({ path: 'orderItems', populate: { path: 'product' } })
        .lean(),
      request.query
    )
      .paginating()
      .productSorting();

    const [orders, totalOrders] = await Promise.all([
      feature.query,
      OrderModel.find(conditions).countDocuments().lean(),
    ]);

    const totalPage = Math.ceil(totalOrders / limit) || 1;

    const response = {
      data: orders,
      currentPage: page,
      length: limit,
      total: totalPage,
    };

    return response;
  } catch (error) {
    next(error);
  }
};

const getSingleOrder = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const order = await OrderModel.findById(request.params.id)
      .populate('user', 'fullname email')
      .populate({
        path: 'orderItems',
        populate: { path: 'product', select: '_id name image oldPrice price description' },
      });

    if (!order) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'Your order does not exist!',
        StatusCode.BadRequest.name
      );
    }

    return order;
  } catch (error) {
    next(error);
  }
};

export { getAllOrderOfUser, getSingleOrder };
