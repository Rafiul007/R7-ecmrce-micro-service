import { Schema, model, Document, Types } from 'mongoose';

export interface ICustomer extends Document {
  userId: Types.ObjectId;
  fullName: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
  };
}

const CustomerSchema = new Schema<ICustomer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User'
    },
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, required: true }
    }
  },
  {
    timestamps: true
  }
);

export const Customer = model<ICustomer>('Customer', CustomerSchema);
