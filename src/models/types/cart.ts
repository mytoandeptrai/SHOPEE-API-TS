import { Document } from 'mongoose';
import Product from './product';
import User from './user';

export default interface Cart extends Document {
  user: User;
  product: Product;
  quantity: number;
}
