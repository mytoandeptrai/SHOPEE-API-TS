import { Order } from 'models/types';
import { model, Model, Schema } from 'mongoose';
import { MODELS } from 'utils/constants/models';

const OrderSchema = new Schema<Order>(
  {
    user: { type: Schema.Types.ObjectId, ref: MODELS.user, require: true },
    shop: { type: Schema.Types.ObjectId, ref: MODELS.shop, require: true },
    orderItems: [
      {
        quantity: { type: Number, required: true },
        product: { type: Schema.Types.ObjectId, ref: MODELS.product, require: true },
      },
    ],
    shippingFrom: { type: String, default: '' },
    shippingTo: { type: String, default: '' },
    price: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    promotion: { type: Number, default: 0 },
    total: { type: Number, required: true },
    note: { type: String, default: '' },
    reasonCancel: { type: String, default: '' },
    status: { type: String, default: 'waiting' },
    statusCode: { type: Number, default: 0 },
    methodPayment: { type: String, default: 'money' },
    processingAt: { type: Date },
    shippingAt: { type: Date },
    deliveredAt: { type: Date },
    canceledAt: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const OrderModel: Model<Order> = model<Order>(MODELS.order, OrderSchema, MODELS.order);
export default OrderModel;
