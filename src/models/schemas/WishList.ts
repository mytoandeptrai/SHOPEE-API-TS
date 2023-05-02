import { WishList } from 'models/types';
import { Model, Schema, model } from 'mongoose';
import { MODELS } from 'utils/constants/models';
const WishListSchema = new Schema<WishList>(
  {
    user: { type: Schema.Types.ObjectId, ref: MODELS.user, require: true },
    wishLists: {
      type: [{ type: Schema.Types.ObjectId, ref: MODELS.product, require: true }],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const WishListModel: Model<WishList> = model<WishList>(MODELS.wishList, WishListSchema, MODELS.wishList);

export default WishListModel;
