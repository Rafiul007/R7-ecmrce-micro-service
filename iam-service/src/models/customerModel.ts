import { Schema } from 'mongoose';
import { IUser, User, UserRole } from './userModel';

export enum CustomerType {
  REGULAR = 'regular',
  VIP = 'vip',
  WHOLESALE = 'wholesale'
}
export interface ICustomer extends IUser {
  address: {
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
  };
  customerType: CustomerType;
}

const CustomerSchema = new Schema<ICustomer>({
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    zipCode: String,
    country: { type: String, required: true }
  },
  customerType: {
    type: String,
    enum: Object.values(CustomerType),
    default: CustomerType.REGULAR
  }
});

export const Customer = User.discriminator<ICustomer>(UserRole.CUSTOMER, CustomerSchema);
