import mongoose, { Schema, Document, Types } from 'mongoose';

export enum CustomerType {
  REGULAR = 'regular',
  VIP = 'vip',
  WHOLESALE = 'wholesale'
}

export interface ICustomerProfile extends Document {
  userId: Types.ObjectId;

  // Core address
  address: {
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
  };

  // Future expansion fields
  addresses?: Array<{
    type?: 'home' | 'work' | 'billing' | 'shipping';
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
    isDefault?: boolean;
  }>;

  // Contact & identity
  secondaryPhone?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';

  // Preferences
  communicationPreferences?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };

  marketingOptIn?: boolean;
  favoriteCategories?: string[];

  // Purchase metadata
  ordersCount?: number;
  totalSpent?: number;
  lastOrderDate?: Date;
  recentlyViewed?: Types.ObjectId[];

  // Loyalty & referral
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyaltyPoints?: number;
  referralCode?: string;
  referredBy?: Types.ObjectId;

  // Subscription
  subscriptionStatus?: 'active' | 'inactive' | 'canceled' | 'expired';
  subscriptionPlan?: string;

  // Internal metadata
  status?: 'active' | 'suspended' | 'archived';
  createdBy?: Types.ObjectId; // adminId or system

  // Category type
  customerType: CustomerType;
}

const CustomerProfileSchema = new Schema<ICustomerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Main Address
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zipCode: String,
      country: { type: String, required: true }
    },

    // List of addresses
    addresses: [
      {
        type: {
          type: String,
          enum: ['home', 'work', 'billing', 'shipping']
        },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: String,
        zipCode: String,
        country: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
      }
    ],

    // Contact & identity metadata
    secondaryPhone: String,
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },

    // Preferences
    communicationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false }
    },

    marketingOptIn: { type: Boolean, default: false },
    favoriteCategories: [String],

    // Purchase metadata
    ordersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: Date,
    recentlyViewed: [{ type: Schema.Types.ObjectId }],

    // Loyalty
    loyaltyTier: {
      type: String,
      enum: ['iron', 'bronze', 'silver', 'gold', 'platinum'],
      default: 'iron'
    },
    loyaltyPoints: { type: Number, default: 0 },
    referralCode: String,
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },

    // Subscription
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'canceled', 'expired']
    },
    subscriptionPlan: String,

    // Internal status & auditing
    status: {
      type: String,
      enum: ['active', 'suspended', 'archived'],
      default: 'active'
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

    // Customer type
    customerType: {
      type: String,
      enum: Object.values(CustomerType),
      default: CustomerType.REGULAR
    }
  },
  { timestamps: true }
);

export const CustomerProfile = mongoose.model<ICustomerProfile>(
  'CustomerProfile',
  CustomerProfileSchema
);
