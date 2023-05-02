import { NextFunction } from 'express';
import { WishListModel } from 'models';
import RequestWithUser from 'utils/rest/request';

const getUserWishLists = async (request: RequestWithUser, next: NextFunction) => {
  const userId = request.user?._id;
  try {
    const wishlistsDB: any = await WishListModel.findOne({ user: userId }).populate({ path: 'wishlists' }).lean();
    const wishlists = wishlistsDB?.wishlists ? wishlistsDB?.wishlists?.reverse() : [];
    return wishlists;
  } catch (error) {
    next(error);
  }
};
export { getUserWishLists };
