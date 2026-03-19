import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDrawer extends Document {
  drawerName: string;
  branchId: Types.ObjectId;
}

const DrawerSchema = new Schema<IDrawer>(
  {
    drawerName: { type: String, required: true, trim: true },
    branchId: { type: Schema.Types.ObjectId, required: true, ref: 'Branch' }
  },
  { timestamps: true }
);

DrawerSchema.index({ branchId: 1, drawerName: 1 }, { unique: true });

export const Drawer = mongoose.model<IDrawer>('Drawer', DrawerSchema);
