import { Category } from 'models/types';
import { model, Model, Schema } from 'mongoose';
import { MODELS } from 'utils/constants/models';

const CategorySchema = new Schema<Category>(
  {
    name: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const CategoryModel: Model<Category> = model<Category>(MODELS.category, CategorySchema, MODELS.category);
export default CategoryModel;
