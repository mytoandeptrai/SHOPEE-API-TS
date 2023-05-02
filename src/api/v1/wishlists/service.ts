import { HttpException } from 'exceptions';
import StatusCode from 'exceptions/statusCode';
import { NextFunction } from 'express';
import { WishListModel } from 'models';
import RequestWithUser from 'utils/rest/request';

const addToWishList = async (request: RequestWithUser, next: NextFunction) => {
  const userId = request.user?._id;
  const productId = request.query.productId;
  try {
    const wishListInDb: any = await WishListModel.findOne({ user: userId });

    if (wishListInDb && wishListInDb.wishLists.includes(productId)) {
      throw new HttpException(
        'TypeError',
        StatusCode.UnProcessable.status,
        'This voucher is already existed',
        StatusCode.UnProcessable.name
      );
    }

    let savedWishlist;
    if (!wishListInDb) {
      const payload = { user: userId, wishlists: [productId] };
      const newWishlist = await WishListModel.create(payload);
      savedWishlist = newWishlist.save();
    } else {
      savedWishlist = await wishListInDb.updateOne({
        $addToSet: { wishlists: productId },
      });
    }

    return savedWishlist;
  } catch (error) {
    next(error);
  }
};

const removeFromWishList = async (request: RequestWithUser, next: NextFunction) => {
  const userId = request.user?._id;
  const productId = request.query.productId;
  try {
    const updateWishlist = await WishListModel.findByIdAndUpdate(userId, {
      $pull: { wishlists: productId },
    });
    return updateWishlist;
  } catch (error) {
    next(error);
  }
};

export { addToWishList, removeFromWishList };
