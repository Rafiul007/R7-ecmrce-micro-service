import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: Types.ObjectId | null;
  isActive: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, maxlength: 1000 },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null }
  },
  { timestamps: true }
);

CategorySchema.index({ parent: 1, name: 1 }, { unique: true });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
