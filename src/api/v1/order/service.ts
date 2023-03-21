import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { CartModel, OrderModel, ProductModel, ShopModel, VoucherModel } from 'models';
import { IShop } from 'types';
import RequestWithUser from 'utils/rest/request';

const createNewOrder = async (request: RequestWithUser, next: NextFunction) => {
  const { _id } = request?.user;
  const { orderItems, voucherCode } = request.body;
  try {
    if (orderItems && orderItems.length === 0) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'Your cart is empty!',
        StatusCode.BadRequest.name
      );
    }

    if (voucherCode) {
      const currentVoucherInDb = await VoucherModel.findOne({ code: voucherCode });
      if (!currentVoucherInDb) {
        throw new HttpException(
          'NotFoundError',
          StatusCode.BadRequest.status,
          'This voucher does not exist',
          StatusCode.BadRequest.name
        );
      }

      if (Number(currentVoucherInDb.expirationDate) < Date.now() / 1000) {
        throw new HttpException(
          'NotFoundError',
          StatusCode.BadRequest.status,
          'This voucher is expired',
          StatusCode.BadRequest.name
        );
      }

      if (currentVoucherInDb.usersUsed.indexOf(_id)) {
        throw new HttpException(
          'NotFoundError',
          StatusCode.BadRequest.status,
          'This voucher is already used',
          StatusCode.BadRequest.name
        );
      }

      currentVoucherInDb.usersUsed.push(_id);
      await currentVoucherInDb.save();
    }
    const shop: IShop = await ShopModel.findOne().lean();

    const saveOrderBody = {
      ...request.body,
      user: _id,
      shippingFrom: shop.address,
    };

    const savedOrder = await OrderModel.create(saveOrderBody);

    for (let index = 0; index < orderItems.length; index++) {
      const order = orderItems[index];
      const orderQuantity = parseInt(order?.quantity);
      const orderProduct = order?.product;
      await Promise.all([
        ProductModel.findOneAndUpdate({ _id: orderProduct }, { $inc: { sold: orderQuantity, stock: -orderQuantity } }),
        CartModel.deleteOne({ user: _id, product: orderProduct }),
      ]);
    }

    return savedOrder;
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const existedOrder = await OrderModel.findByIdAndDelete(request.params.id);

    if (!existedOrder) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.BadRequest.status,
        'This order does not exist',
        StatusCode.BadRequest.name
      );
    }

    if (existedOrder.user.toString() !== request.user._id) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.Unauthorized.status,
        `This order cannot delete this order`,
        StatusCode.Unauthorized.name
      );
    }

    await existedOrder.remove();
    return existedOrder;
  } catch (error) {
    next(error);
  }
};

export { createNewOrder, deleteOrder };
