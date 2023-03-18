import { Cart } from 'models/types';
import { model, Model, Schema } from 'mongoose';
import { MODELS } from 'utils/constants/models';

const CartSchema = new Schema<Cart>(
  {
    user: { type: Schema.Types.ObjectId, ref: MODELS.user, require: true },
    product: { type: Schema.Types.ObjectId, ref: MODELS.product, require: true },
    quantity: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const CartModel: Model<Cart> = model<Cart>(MODELS.cart, CartSchema, MODELS.cart);
export default CartModel;
