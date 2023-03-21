import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { OrderModel } from 'models';
import { STATUS_ORDER } from 'utils/constants';
import RequestWithUser from 'utils/rest/request';

const updateStatusOfOrder = async (request: RequestWithUser, next: NextFunction) => {
  const orderId = request?.params?.id;
  const { status = STATUS_ORDER.PROCESSING.status, message = STATUS_ORDER.PROCESSING.message } = request.query;
  try {
    const currentOrder: any = await OrderModel.findById(orderId).populate({
      path: 'orderItems',
      populate: { path: 'product' },
    });
    if (!currentOrder) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This order does not exist!',
        StatusCode.BadRequest.name
      );
    }

    if (status === STATUS_ORDER.PROCESSING.status) currentOrder.processingAt = Date.now();
    if (status === STATUS_ORDER.SHIPPING.status) currentOrder.shippingAt = Date.now();
    if (status === STATUS_ORDER.DELIVERED.status) currentOrder.deliveredAt = Date.now();
    if (status === STATUS_ORDER.CANCELED.status) currentOrder.canceledAt = Date.now();

    currentOrder.status = status;
    currentOrder.statusCode = message;

    const updatedOrder = await currentOrder.save();

    return updatedOrder;
  } catch (error) {
    next(error);
  }
};

export { updateStatusOfOrder };
