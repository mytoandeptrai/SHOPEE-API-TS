import { Document } from 'mongoose';

export default interface Banner extends Document {
  bannerUrl: string;
}
