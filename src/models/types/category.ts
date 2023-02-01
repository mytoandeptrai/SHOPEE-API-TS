import { Document } from 'mongoose';

export default interface Category extends Document {
  name: string;
  slug: string;
  image: string;
}
