import { Document } from 'mongoose';
import Order from './order';
import Product from './product';
import User from './user';

export default interface Review extends Document {
  productId: Product;
  orderId: Order;
  comment: string;
  rating: number;
  user: User;
}
