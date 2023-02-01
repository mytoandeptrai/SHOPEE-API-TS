import { Banner } from 'models/types';
import { model, Model, Schema } from 'mongoose';
import { MODELS } from 'utils/constants/models';

const BannerSchema = new Schema<Banner>(
  { bannerUrl: { type: String, unique: true, required: true } },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const BannerModel: Model<Banner> = model<Banner>(MODELS.banner, BannerSchema, MODELS.banner);
export default BannerModel;
