import { Schema, model, Document, Types } from 'mongoose';

interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const User = model<IUser>('User', UserSchema);
