import { Product } from 'models/types';
import { model, Model, Schema } from 'mongoose';
import { MODELS } from 'utils/constants/models';

const ProductSchema = new Schema<Product>(
  {
    name: { type: String, require: true },
    image: { type: String, require: true },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: MODELS.category, require: true },
    oldPrice: { type: Number, default: 0 },
    price: { type: Number, require: true },
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const ProductModel: Model<Product> = model<Product>(MODELS.product, ProductSchema, MODELS.product);
export default ProductModel;
