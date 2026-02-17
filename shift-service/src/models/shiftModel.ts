import mongoose, { Schema, Document, Types } from 'mongoose';

export enum ShiftStatus {
  OPEN = 'open',
  CLOSED = 'closed'
}

export interface IShift extends Document {
  branchId: string;
  branchName: string;
  employeeId: string;
  openedBy: Types.ObjectId;
  openedByName?: string;
  openedAt: Date;
  openingCash: number;
  cashSalesTotal: number;
  cashInTotal: number;
  cashOutTotal: number;
  closingCash?: number;
  closedAt?: Date;
  closedBy?: Types.ObjectId;
  closedByName?: string;
  expectedCash: number;
  overShort: number;
  status: ShiftStatus;
  notes?: string;
}

const ShiftSchema = new Schema<IShift>(
  {
    branchId: { type: String, required: true, trim: true },
    branchName: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, trim: true },

    openedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    openedByName: { type: String, trim: true },
    openedAt: { type: Date, default: Date.now },
    openingCash: { type: Number, required: true, min: 0 },

    cashSalesTotal: { type: Number, default: 0, min: 0 },

    cashInTotal: { type: Number, default: 0, min: 0 },
    cashOutTotal: { type: Number, default: 0, min: 0 },

    closingCash: { type: Number, min: 0 },
    closedAt: { type: Date },
    closedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    closedByName: { type: String, trim: true },

    expectedCash: { type: Number, default: 0 },
    overShort: { type: Number, default: 0 },

    status: { type: String, enum: Object.values(ShiftStatus), default: ShiftStatus.OPEN },

    notes: { type: String, trim: true, maxlength: 2000 }
  },
  { timestamps: true }
);

ShiftSchema.index({ branchId: 1, status: 1 });
ShiftSchema.index({ openedBy: 1, status: 1 });
ShiftSchema.index({ employeeId: 1, status: 1 });

export const Shift = mongoose.model<IShift>('Shift', ShiftSchema);
