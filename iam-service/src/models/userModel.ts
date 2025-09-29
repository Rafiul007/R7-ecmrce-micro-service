import mongoose, { Document, Schema, Types } from 'mongoose';

export enum UserRole {
  USER = 'user',
  CUSTOMER = 'customer',
  STAFF = 'staff',
  EMPLOYEE = 'employee',
  ADMIN = 'admin'
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  password: string;

  role: UserRole;
  permissions?: string[];

  emailVerified?: boolean;
  phoneVerified?: boolean;

  passwordResetToken?: string;
  passwordResetExpires?: Date;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER
    },

    permissions: [{ type: String }],

    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },

    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, discriminatorKey: 'role' }
);

export const User = mongoose.model<IUser>('User', UserSchema);
