import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { CartModel, ProductModel } from 'models';
import { Cart } from 'models/types';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { IPayloadProductCart } from 'types';
import { convertStringToObjectId } from 'utils/common';
import RequestWithUser from 'utils/rest/request';

const addNewProductToCart = async (payload: IPayloadProductCart) => {
  const { userId, productId, quantity } = payload;
  const newCart = { user: convertStringToObjectId(userId), product: convertStringToObjectId(productId), quantity };
  const savedCart = await new CartModel(newCart).save();
  return savedCart;
};
const updateQuantityProductInCart = async (payload: IPayloadProductCart) => {
  const { userId, productId, quantity } = payload;

  const filter: FilterQuery<Cart> = {
    user: convertStringToObjectId(userId),
    product: convertStringToObjectId(productId),
  };
  const update: UpdateQuery<Cart> = { quantity };

  const updatedCart = await CartModel.findOneAndUpdate(filter, update, { new: true });
  return updatedCart;
};

const addToCart = async (request: RequestWithUser, next: NextFunction) => {
  const userId = request.user._id;
  const { productId, quantity } = request.body;
  try {
    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.NotFound.status,
        'This product does not exist',
        StatusCode.NotFound.name
      );
    }

    if (product.stock <= 0) {
      throw new HttpException(
        'NotAcceptableError',
        StatusCode.NotAcceptable.status,
        'This product is out of stock',
        StatusCode.NotAcceptable.name
      );
    }

    if (quantity > product.stock) {
      throw new HttpException(
        'NotAcceptableError',
        StatusCode.NotAcceptable.status,
        `There are only ${product.stock} products in stock`,
        StatusCode.NotAcceptable.name
      );
    }

    let savedCart: any;
    const filter: FilterQuery<Cart> = {
      user: convertStringToObjectId(userId),
      product: convertStringToObjectId(productId),
    };
    const cartInDb = await CartModel.findOne(filter);
    const payload = { userId, productId, quantity };

    if (cartInDb) {
      savedCart = await updateQuantityProductInCart(payload);
    } else {
      savedCart = await addNewProductToCart(payload);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    savedCart ? (savedCart.product = product) : savedCart;

    return savedCart;
  } catch (error) {
    next(error);
  }
};

const deleteSingleCart = async (request: RequestWithUser, next: NextFunction) => {
  const userId = request.user._id;
  const cartId = request.params.id;
  try {
    const deletedData = await CartModel.deleteMany({
      user: userId,
      _id: { $in: cartId },
    });

    if (!deletedData) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.NotFound.status,
        'This cart does not exist',
        StatusCode.NotFound.name
      );
    }

    return deletedData;
  } catch (error) {
    next(error);
  }
};

const deleteAllCarts = async (request: RequestWithUser, next: NextFunction) => {
  const userId = request.user._id;
  try {
    const deletedData = await CartModel.deleteMany({
      user: userId,
    });

    if (!deletedData) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.NotFound.status,
        'This cart does not exist',
        StatusCode.NotFound.name
      );
    }

    return deletedData;
  } catch (error) {
    next(error);
  }
};

export { addToCart, deleteSingleCart, deleteAllCarts };
