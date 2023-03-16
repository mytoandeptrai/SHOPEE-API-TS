/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction } from 'express';
import { CategoryModel } from 'models';
import RequestWithUser from 'utils/rest/request';

const getAllCategories = async (request: RequestWithUser, next: NextFunction) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    return categories;
  } catch (error) {
    next(error);
  }
};

export { getAllCategories };
