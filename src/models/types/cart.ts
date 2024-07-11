import { Document, ObjectId } from 'mongoose';

export default interface Cart extends Document {
  user: ObjectId;
  product: ObjectId;
  quantity: number;
}
