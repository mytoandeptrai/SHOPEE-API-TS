import { Document } from 'mongoose';
import User from './user';
import Product from './product';

export default interface WishList extends Document {
  user: User;
  wishLists: Product[];
}
