import { Document } from 'mongoose';

export default interface Token extends Document {
  refreshToken: string;
}
