import { Document } from 'mongoose';
import Product from './product';
import User from './user';

interface OrderItem {
  quantity: number;
  product: Product;
}

export default interface Order extends Document {
  user: User;
  orderItems: OrderItem[];
  shippingFrom: string;
  shippingTo: string;
  price: number;
  shippingFee: number;
  promotion: number;
  total: number;
  note: string;
  reasonCancel: string;
  status: 'waiting' | 'processing' | 'shipping' | 'delivered' | 'canceled';
  statusCode: 0 | 1 | 2 | 3 | 4;
  methodPayment: 'money' | 'credit-card';
  processingAt: Date;
  shippingAt: Date;
  deliveredAt: Date;
  canceledAt: Date;
}
