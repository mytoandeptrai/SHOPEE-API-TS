import config from 'config';
import { Redis } from 'models/types';
import { model, Model, Schema } from 'mongoose';
import { MODELS } from 'utils/constants/models';

const RedisSchema = new Schema<Redis>({
  redisKey: { type: String, unique: true },
  expireAt: {
    type: Date,
    default: new Date(),
  },
});

RedisSchema.index({ expireAt: 1 }, { expireAfterSeconds: Number(config.cacheExpire) });

const RedisModel: Model<Redis> = model<Redis>(MODELS.redis, RedisSchema, MODELS.redis);
export default RedisModel;
