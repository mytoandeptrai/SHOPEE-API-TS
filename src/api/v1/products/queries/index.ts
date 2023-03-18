/* eslint-disable @typescript-eslint/naming-convention */
import config from 'config';
import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { APIFeatures } from 'libs/APIFeatures';
import { ProductModel, RedisModel } from 'models';
import { setEX } from 'resources/redis';
import url from 'url';
import { DEFAULT_PAGING } from 'utils/constants';
import RequestWithUser from 'utils/rest/request';
const getAllProducts = async (request: RequestWithUser, next: NextFunction) => {
  let {
    category,
    rating,
    price_max,
    price_min,
    name,
    page = DEFAULT_PAGING.CURRENT_PAGE,
    limit = DEFAULT_PAGING.LIMIT_PER_PAGE,
  } = request.query;
  page = Number(page);
  limit = Number(limit);

  const queryString = JSON.stringify(request.query);
  const getUrl = url.parse(queryString, true).href;

  try {
    let conditions: any = {};
    if (category) conditions.category = category;
    if (rating) conditions.rating = { $gte: rating };
    if (price_max) conditions.price = { $lte: price_max };

    if (price_min) {
      conditions.price = conditions.price ? { ...conditions.price, $gte: price_min } : { $gte: price_min };
    }

    if (name) conditions.name = { $regex: name, $options: 'i' };

    const feature = new (APIFeatures as any)(
      ProductModel.find(conditions).populate({ path: 'category' }).select({ __v: 0, description: 0 }).lean(),
      request.query
    )
      .paginating()
      .productSorting();

    const [products, totalProducts] = await Promise.all([
      feature.query,
      ProductModel.find(conditions).countDocuments().lean(),
    ]);

    const totalPage = Math.ceil(totalProducts / limit) || 1;

    const response = {
      data: products,
      currentPage: page,
      length: limit,
      total: totalPage,
    };

    await setEX(`products:${getUrl}`, Number(config.cacheExpire), JSON.stringify(response));
    await RedisModel.create({ redisKey: `products:${getUrl}` });

    return response;
  } catch (error) {
    next(error);
  }
};

const getSingleProduct = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const product = await ProductModel.findById(request.params.id);
    if (!product) {
      throw new HttpException(
        'NotFoundError',
        StatusCode.NotFound.status,
        'This product is not exists!',
        StatusCode.NotFound.name
      );
    }

    const getUrl = url.parse(request.url, true).href;
    await setEX(`product:${getUrl}`, Number(config.cacheExpire), JSON.stringify(product));
    await RedisModel.create({ redisKey: `product:${getUrl}` });

    return product;
  } catch (error) {
    next(error);
  }
};

const getProductsOfShop = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const shopId = request.params?.shopId;
    const products = await ProductModel.find({ shop: shopId });
    return products;
  } catch (error) {
    next(error);
  }
};

export { getAllProducts, getSingleProduct, getProductsOfShop };
