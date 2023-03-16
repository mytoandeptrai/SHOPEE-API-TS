import { Document } from 'mongoose';
import User from './user';

interface CommonKeyValue {
  id: string;
  name: string;
}

export default interface Shop extends Document {
  name: string;
  avatar: string;
  city: CommonKeyValue;
  district: CommonKeyValue;
  ward: CommonKeyValue;
  street: string;
  address: string;
  slug: string;
  user: User;
}
