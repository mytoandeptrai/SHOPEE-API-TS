import { Shop } from 'models/types';
import { model, Model, Schema } from 'mongoose';
import { MODELS } from 'utils/constants/models';
import slugify from 'slugify';
import ProductModel from './Product';
const ShopSchema = new Schema<Shop>(
  {
    name: { type: String, require: true },
    avatar: { type: String, require: true },
    city: { id: { type: String, default: '' }, name: { type: String, default: '' } },
    district: { id: { type: String, default: '' }, name: { type: String, default: '' } },
    ward: { id: { type: String, default: '' }, name: { type: String, default: '' } },
    street: { type: String, default: '' },
    address: { type: String, default: '' },
    user: { type: Schema.Types.ObjectId, ref: MODELS.category, require: true },
    slug: { type: String, default: '' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Create shop slug from the name before save
ShopSchema.pre('save', async function (this: Shop, next: (err?: Error | undefined) => void) {
  this.slug = slugify(this.name, { lower: true, remove: /[*+~.()'"!:@]/g });
  next();
});

// Cascade delete products when a shop is deleted
ShopSchema.pre('remove', async function (this: Shop, next: (err?: Error | undefined) => void) {
  console.log(`Products is being removed from shop ${this._id}`);
  await ProductModel.deleteMany({ shop: this._id });
  next();
});

const ShopModel: Model<Shop> = model<Shop>(MODELS.shop, ShopSchema, MODELS.shop);

export default ShopModel;
