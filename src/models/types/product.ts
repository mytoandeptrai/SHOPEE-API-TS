import { Document, ObjectId } from 'mongoose';
import Category from './category';
import Shop from './shop';

export default interface Product extends Document {
  _id: string | ObjectId;
  name: string;
  image: string;
  images: string[];
  description: string;
  category: Category;
  oldPrice: number;
  price: number;
  rating: number;
  stock: number;
  sold: number;
  view: number;
  shop: Shop;
}
