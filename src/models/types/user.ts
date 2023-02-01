import { Document } from 'mongoose';

interface IObjectInformation {
  id: string;
  name: string;
}

interface ICreditCard {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

export default interface User extends Document {
  email: string;
  fullname?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  password: string;
  street?: string;
  address?: string;
  city?: IObjectInformation;
  district?: IObjectInformation;
  ward?: IObjectInformation;
  creditCard?: ICreditCard;
  role: string;
}
