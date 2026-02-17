import mongoose, { Schema, Document, Types } from 'mongoose';

export enum CashMovementType {
  IN = 'in',
  OUT = 'out'
}

export interface ICashMovement extends Document {
  shift: Types.ObjectId;
  type: CashMovementType;
  amount: number;
  reason?: string;
  createdBy?: Types.ObjectId;
  createdByName?: string;
}

const CashMovementSchema = new Schema<ICashMovement>(
  {
    shift: { type: Schema.Types.ObjectId, ref: 'Shift', required: true },
    type: { type: String, enum: Object.values(CashMovementType), required: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdByName: { type: String, trim: true }
  },
  { timestamps: true }
);

CashMovementSchema.index({ shift: 1, createdAt: -1 });

export const CashMovement = mongoose.model<ICashMovement>('CashMovement', CashMovementSchema);
