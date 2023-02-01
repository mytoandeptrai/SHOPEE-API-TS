import { Document } from 'mongoose';
import Category from './category';

export default interface Product extends Document {
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
}
