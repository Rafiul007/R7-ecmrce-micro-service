import mongoose, { Schema, Document, Types } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  EMPLOYEE = 'employee'
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  phone?: string;

  roles: UserRole[];
  emailVerified: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    phone: { type: String },

    password: { type: String, required: true, },

    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.USER]
    },

    emailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
