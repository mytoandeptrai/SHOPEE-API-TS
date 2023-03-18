import { Review } from 'models/types';
import { model, Model, Schema } from 'mongoose';
import { MODELS } from 'utils/constants/models';

const ReviewSchema = new Schema<Review>(
  {
    user: { type: Schema.Types.ObjectId, ref: MODELS.user, require: true },
    productId: { type: Schema.Types.ObjectId, ref: MODELS.product, require: true },
    orderId: { type: Schema.Types.ObjectId, ref: MODELS.order },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Allow only 1 review / 1 user
ReviewSchema.index({ productId: 1, user: 1 }, { unique: true });

// Call getAverageRating after save a new review
ReviewSchema.post('save', async function (doc, next: (err?: Error | undefined) => void) {
  next();
});

// Cascade delete products when a shop is deleted
ReviewSchema.pre('remove', async function (next: (err?: Error | undefined) => void) {
  next();
});

const ReviewModel: Model<Review> = model<Review>(MODELS.review, ReviewSchema, MODELS.review);

export default ReviewModel;
