import { NextFunction } from 'express';
import { CategoryModel, ProductModel, VoucherModel } from 'models';
import { categorySeeder, productSeeders, voucherSeeder } from 'seeders';
import RequestWithUser from 'utils/rest/request';

const insertProduct = async (request: RequestWithUser, next: NextFunction) => {
  try {
    await ProductModel.remove({});
    const products = await ProductModel.insertMany(productSeeders);
    return products;
  } catch (error) {
    next(error);
  }
};

const insertCategory = async (request: RequestWithUser, next: NextFunction) => {
  try {
    await CategoryModel.remove({});
    const categories = await CategoryModel.insertMany(categorySeeder);
    return categories;
  } catch (error) {
    next(error);
  }
};

const insertVoucher = async (request: RequestWithUser, next: NextFunction) => {
  try {
    await VoucherModel.remove({});
    const categories = await VoucherModel.insertMany(voucherSeeder);
    return categories;
  } catch (error) {
    next(error);
  }
};

export { insertProduct, insertCategory, insertVoucher };
