import mongoose, { Schema, Document, Types } from 'mongoose';

export enum ShiftStatus {
  OPEN = 'open',
  CLOSED = 'closed'
}

export interface IBranch {
  branchName: string;
  branchLocation?: string;
  branchManagerId?: string;
}

export interface IDrawer {
  drawerName: string;
  branchId: Types.ObjectId;
}

export interface IShift extends Document {
  branch: IBranch;
  drawer: IDrawer;
  openedBy: Types.ObjectId;
  openedAt: Date;
  openingCash: number;
  cashSalesTotal: number;
  cashInTotal: number;
  cashOutTotal: number;
  closingCash?: number;
  closedAt?: Date;
  closedBy?: Types.ObjectId;
  expectedCash: number;
  overShort: number;
  status: ShiftStatus;
  notes?: string;
}

const BranchSchema = new Schema<IBranch>(
  {
    branchName: { type: String, required: true, trim: true },
    branchLocation: { type: String, trim: true },
    branchManagerId: { type: String, trim: true }
  },
  { _id: false }
);

const DrawerSchema = new Schema<IDrawer>(
  {
    drawerName: { type: String, required: true, trim: true },
    branchId: { type: Schema.Types.ObjectId, required: true, ref: 'Branch' }
  },
  { _id: false }
);

const ShiftSchema = new Schema<IShift>(
  {
    branch: { type: BranchSchema, required: true },
    drawer: { type: DrawerSchema, required: true },

    openedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    openedAt: { type: Date, default: Date.now },
    openingCash: { type: Number, required: true, min: 0 },

    cashSalesTotal: { type: Number, default: 0, min: 0 },
    cashInTotal: { type: Number, default: 0, min: 0 },
    cashOutTotal: { type: Number, default: 0, min: 0 },

    closingCash: { type: Number, min: 0 },
    closedAt: { type: Date },
    closedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    expectedCash: { type: Number, default: 0 },
    overShort: { type: Number, default: 0 },

    status: {
      type: String,
      enum: Object.values(ShiftStatus),
      default: ShiftStatus.OPEN
    },

    notes: { type: String, trim: true, maxlength: 2000 }
  },
  { timestamps: true }
);

ShiftSchema.index({ 'drawer.branchId': 1, status: 1 });
ShiftSchema.index({ openedBy: 1, status: 1 });

export const Shift = mongoose.model<IShift>('Shift', ShiftSchema);
