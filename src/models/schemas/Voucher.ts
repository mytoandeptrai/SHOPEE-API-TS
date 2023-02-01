import { Voucher } from 'models/types';
import { model, Model, Schema } from 'mongoose';
import { MODELS } from 'utils/constants/models';

const VoucherSchema = new Schema<Voucher>(
  {
    code: { type: String, unique: true, require: true },
    value: { type: Number, require: true },
    title: { type: String, require: true },
    expirationDate: { type: Number, default: new Date(Date.now() + 3600 * 1000 * 24) },
    usersUsed: { type: [Schema.Types.ObjectId], required: true, ref: MODELS.user, default: [] },
    usersSave: { type: [Schema.Types.ObjectId], required: true, ref: MODELS.user, default: [] },
    isPublic: { type: Boolean, default: true },
    isFreeship: { type: Boolean, default: false },
    expired: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const VoucherModel: Model<Voucher> = model<Voucher>(MODELS.voucher, VoucherSchema, MODELS.voucher);
export default VoucherModel;
