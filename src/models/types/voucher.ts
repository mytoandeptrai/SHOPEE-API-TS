import { Document } from 'mongoose';
import User from './user';

export default interface Voucher extends Document {
  code: string;
  value: number;
  title: string;
  usersUsed: User[];
  usersSave: User[];
  isPublic: boolean;
  isFreeship: boolean;
  expired: boolean;
  expirationDate: number | Date;
}
