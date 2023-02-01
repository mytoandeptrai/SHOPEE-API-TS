import { Document } from 'mongoose';

export default interface Redis extends Document {
  redisKey: string;
  expireAt: Date;
}
