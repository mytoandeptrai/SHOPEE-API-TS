import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { CartModel, OrderModel, ProductModel, ShopModel, VoucherModel } from 'models';
import { calcPriceWithShippingFee, calcTotalPrice } from 'utils/common';
import RequestWithUser from 'utils/rest/request';

interface IOrderItem {
  quantity: number;
  product: string;
  productOldPrice: number;
  productPrice: number;
}

const filterCartItemByShop = (orderItems: any[]) => {
  let object: { [key: string]: IOrderItem[] } = {};

  orderItems.forEach((order: any) => {
    const orderQuantity = parseInt(order?.quantity);
    const orderProduct = order?.product;
    const orderShop = order?.shop;
    const orderOldPrice = parseInt(order?.oldPrice);
    const orderPrice = parseInt(order?.price);

    if (!object[orderShop?._id]) {
      object[orderShop?._id] = [
        { quantity: orderQuantity, product: orderProduct, productOldPrice: orderOldPrice, productPrice: orderPrice },
      ];
    } else {
      object[orderShop?._id].push({
        quantity: orderQuantity,
        product: orderProduct,
        productOldPrice: orderOldPrice,
        productPrice: orderPrice,
      });
    }
  });

  return object;
};

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

    const filteredOrderBaseShop: { [key: string]: IOrderItem[] } = filterCartItemByShop(orderItems);

    let saveOrderBody = [];
    for (const [key, value] of Object.entries(filteredOrderBaseShop)) {
      let newOrder = {};
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const productShop = await ShopModel.findById(key).lean();
      const price = calcTotalPrice(value, 'productPrice');
      const oldPrice = calcTotalPrice(value, 'productOldPrice');
      const totalPrice = calcPriceWithShippingFee(price, request.body.shippingFee);
      const currentOrderItems = [...value].map((el: IOrderItem) => ({
        quantity: el.quantity,
        product: el.product,
      }));
      if (!productShop) {
        newOrder = {
          ...request.body,
          user: _id,
          shippingFrom: 'Unknown Location',
          orderItems: currentOrderItems,
          price,
          total: totalPrice,
          oldPrice,
        };
      } else {
        newOrder = {
          ...request.body,
          user: _id,
          shippingFrom: productShop.address,
          orderItems: currentOrderItems,
          price,
          total: totalPrice,
          oldPrice,
        };
      }
      saveOrderBody.push(newOrder);
    }

    saveOrderBody = saveOrderBody.map((el) => new OrderModel(el));
    await OrderModel.insertMany(saveOrderBody);

    for (let index = 0; index < orderItems.length; index++) {
      const order = orderItems[index];
      const orderQuantity = parseInt(order?.quantity);
      const orderProduct = order?.product;
      await Promise.all([
        ProductModel.findOneAndUpdate({ _id: orderProduct }, { $inc: { sold: orderQuantity, stock: -orderQuantity } }),
        CartModel.deleteOne({ user: _id, product: orderProduct }),
      ]);
    }

    return saveOrderBody;
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
