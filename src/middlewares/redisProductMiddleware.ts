import StatusCode from 'exceptions/statusCode';
import { NextFunction, Response } from 'express';
import { get } from 'resources/redis';
import url from 'url';
import RequestWithUser from 'utils/rest/request';
import { ApiResponse, Meta } from 'utils/rest/response';

const checkCachedAllProducts = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const queryString = JSON.stringify(request.query);
  const getUrl = url.parse(queryString, true).href;

  try {
    let data: any = await get(`products:${getUrl}`);
    if (data !== null) {
      data = JSON.parse(data);
      const meta = new Meta(data?.currentPage, data?.length, data?.total);
      return new ApiResponse(data?.data, 'OK', 200, Date.now() - request.startTime, Object(meta)).send(response);
    }

    next();
  } catch (error) {
    next({
      name: error.name,
      message: error.message,
      status: StatusCode.InternalServerError.status,
    });
  }
};

const checkCachedSingleProduct = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  try {
    const getUrl = url.parse(request.url, true).href;
    let data: any = await get(`product:${getUrl}`);
    if (data !== null) {
      data = JSON.parse(data);
      return new ApiResponse(data, 'OK', 200, Date.now() - request.startTime).send(response);
    }

    next();
  } catch (error) {
    next({
      name: error.name,
      message: error.message,
      status: StatusCode.InternalServerError.status,
    });
  }
};

const redisProductMiddleware = {
  checkCachedAllProducts,
  checkCachedSingleProduct,
};

export { redisProductMiddleware };
