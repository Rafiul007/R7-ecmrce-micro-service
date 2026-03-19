import mongoose, { Document, Schema } from 'mongoose';

export interface IBranch extends Document {
  branchName: string;
  branchLocation?: string;
  branchManagerId?: string;
}

const BranchSchema = new Schema<IBranch>(
  {
    branchName: { type: String, required: true, trim: true, unique: true },
    branchLocation: { type: String, trim: true },
    branchManagerId: { type: String, trim: true }
  },
  { timestamps: true }
);

export const Branch = mongoose.model<IBranch>('Branch', BranchSchema);
